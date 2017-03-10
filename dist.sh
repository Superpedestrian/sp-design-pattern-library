git config --global user.email "dev-ops@superpedestrian.com"
git config --global user.name "Travis-CI"
git config credential.helper "store --file=.git/credentials"
echo "https://${GH_TOKEN}:@github.com" > .git/credentials
gulp commitdist
