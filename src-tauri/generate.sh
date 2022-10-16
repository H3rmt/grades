# sea-orm-cli on windows causes random 14 error code when generating entities from db
# => run in WSL
git fetch --all
git reset --hard HEAD # reset to current head
git pull
chmod +x ./generate.sh  # add execute permission back after reset
echo "DATABASE_URL=sqlite:///home/enrico/grades/src-tauri/db.db" > .env
touch db.db # setup db
sea-orm-cli migrate -d './migrations/' fresh
sea-orm-cli generate entity -o ./entity/src/ --with-serde both --expanded-format
cp entity/src/* /mnt/c/Users/stemm/IdeaProjects/grades/src-tauri/entity/src/ # copy entities to windows