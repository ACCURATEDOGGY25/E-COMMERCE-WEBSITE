#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
source "$ROOT/scripts/env.sh"
REF="tfqchbjkykeuvlvqleor"
PASS="${1:-Derrick_12345.%24}"
ENV="$ROOT/backend/.env"

regions=(
  us-east-1 us-east-2 us-west-1 us-west-2
  eu-west-1 eu-west-2 eu-west-3 eu-central-1 eu-central-2 eu-north-1
  ap-south-1 ap-southeast-1 ap-southeast-2 ap-northeast-1 ap-northeast-2
  ca-central-1 sa-east-1
)

for prefix in aws-0 aws-1; do
  for region in "${regions[@]}"; do
    db="postgresql://postgres.${REF}:${PASS}@${prefix}-${region}.pooler.supabase.com:5432/postgres"
    pool="postgresql://postgres.${REF}:${PASS}@${prefix}-${region}.pooler.supabase.com:6543/postgres?pgbouncer=true"
    sed -i.bak "s|^DATABASE_URL=.*|DATABASE_URL=\"${pool}\"|" "$ENV"
    sed -i.bak "s|^DIRECT_URL=.*|DIRECT_URL=\"${db}\"|" "$ENV"
    out=$(cd "$ROOT/backend" && npx prisma db push 2>&1) || true
    if echo "$out" | grep -qiE "is now in sync|already in sync"; then
      echo "OK: ${prefix}-${region}"
      rm -f "$ENV.bak"
      exit 0
    fi
    err=$(echo "$out" | grep -iE "FATAL|Error: P1001|Tenant|ENOTFOUND" | head -1)
    echo "fail ${prefix}-${region}: ${err:-unknown}"
  done
done
rm -f "$ENV.bak"
exit 1
