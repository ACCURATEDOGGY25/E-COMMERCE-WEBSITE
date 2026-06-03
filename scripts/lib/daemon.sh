# Source from other scripts: start_daemon LOG command args...
# Note: background jobs may stop when Cursor agent shell exits — use scripts/run-markethub.sh in Terminal.
start_daemon() {
  local log="$1"
  shift
  mkdir -p "$(dirname "$log")"
  if command -v setsid >/dev/null 2>&1; then
    setsid nohup "$@" >>"$log" 2>&1 </dev/null &
  else
    nohup "$@" >>"$log" 2>&1 </dev/null &
  fi
  disown -h $! 2>/dev/null || true
}
