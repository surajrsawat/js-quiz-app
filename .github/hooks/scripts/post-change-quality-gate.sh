#!/usr/bin/env bash

set -u

strict_coverage="${HOOK_STRICT_COVERAGE:-0}"
strict_sonar="${HOOK_STRICT_SONAR:-0}"

payload="$(cat)"

extract_field() {
  local js="$1"
  PAYLOAD="$payload" node -e "
    const key = process.argv[1];
    const raw = process.env.PAYLOAD || '';
    try {
      const data = JSON.parse(raw);
      const value =
        data[key] ??
        data.hookSpecificInput?.[key] ??
        data.toolInput?.[key] ??
        data.tool_name ??
        data.toolName ??
        '';
      process.stdout.write(String(value || ''));
    } catch {
      process.stdout.write('');
    }
  " "$js"
}

tool_name="$(extract_field toolName)"
if [[ -z "$tool_name" ]]; then
  tool_name="$(extract_field tool_name)"
fi

# Only enforce this gate after tool calls that can modify workspace files.
case "$tool_name" in
  apply_patch|create_file|edit_notebook_file|vscode_renameSymbol)
    ;;
  *)
    exit 0
    ;;
esac

run_or_fail() {
  local title="$1"
  local cmd="$2"

  printf "[hook] %s\n" "$title"
  if ! eval "$cmd"; then
    printf "[hook] failed: %s\n" "$title" >&2
    return 1
  fi
  return 0
}

run_or_warn() {
  local title="$1"
  local cmd="$2"

  printf "[hook] %s\n" "$title"
  if ! eval "$cmd"; then
    printf "[hook] warning: %s\n" "$title" >&2
    return 1
  fi
  return 0
}

# First attempt safe automatic fixes.
printf "[hook] running auto-fix pass\n"
npm run lint -- --fix >/dev/null 2>&1 || true

# TypeScript issues.
if ! run_or_fail "TypeScript check" "npx tsc -p tsconfig.json --noEmit"; then
  npm run lint -- --fix >/dev/null 2>&1 || true
  run_or_fail "TypeScript check (retry)" "npx tsc -p tsconfig.json --noEmit" || exit 2
fi

# Coverage gate.
if ! run_or_warn "Coverage check" "npm run coverage"; then
  npm run lint -- --fix >/dev/null 2>&1 || true
  if ! run_or_warn "Coverage check (retry)" "npm run coverage"; then
    if [[ "$strict_coverage" == "1" ]]; then
      exit 2
    fi
  fi
fi

# Sonar issues check (best effort unless scanner is configured locally).
if command -v sonar-scanner >/dev/null 2>&1; then
  if ! run_or_warn "Sonar check" "sonar-scanner"; then
    npm run lint -- --fix >/dev/null 2>&1 || true
    if ! run_or_warn "Sonar check (retry)" "sonar-scanner"; then
      if [[ "$strict_sonar" == "1" ]]; then
        exit 2
      fi
    fi
  fi
else
  printf "[hook] sonar-scanner not found; skipping Sonar CLI check.\n" >&2
  if [[ "$strict_sonar" == "1" ]]; then
    exit 2
  fi
fi

exit 0
