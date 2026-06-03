# Source from other scripts: start_daemon LOG command args...
start_daemon() {
  local log="$1"
  shift
  mkdir -p "$(dirname "$log")"
  nohup "$@" >>"$log" 2>&1 &
  disown -h $! 2>/dev/null || true
}
