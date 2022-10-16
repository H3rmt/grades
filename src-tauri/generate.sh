# sea-orm-cli on windows causes random 14 error code when generating entities from db
# => run in WSL
git fetch --all
git reset --hard HEAD
echo "DATABASE_URL=sqlite://C:/Users/stemm/AppData/Roaming/grades/db.db" > .env
touch db.db
sea-orm-cli migrate -d './migrations/' fresh
sea-orm-cli generate entity -o ./entity/src/ --with-serde both --expanded-format
cp entity/src/* /mnt/c/Users/stemm/IdeaProjects/grades/src-tauri/entity/src/