#!/bin/bash
set -e

if [[ $1 == "production" ]];
	then
cat >.env <<EOL
NODE_PATH=src
REACT_APP_ENV='production'
REACT_APP_API_URL=https://api.ybit.io
REACT_APP_SITE_URL=https://ybit.io
REACT_APP_ADMIN_URL=https://admin.ybit.io
REACT_APP_APPARATUS_EMAIL_URL=http://ybit.io/login/:apparatus:
REACT_APP_APPARATUS_LINK_APPSTORE=https://itunes.apple.com/us/app/apparatus-app/id1317271136?ls=1&mt=8
REACT_APP_APPARATUS_LINK_GOOGLEPLAY=https://play.google.com/store/apps/details?id=com.apparatusapp
REACT_APP_BUGSNAG_KEY=9ed18e9f16b277d23b070e665adba8f6
REACT_APP_RELEASE_STAGE=production
EOL
echo "Production environment created"

elif [[ $1 == "stage" ]];
	then
cat >.env <<EOL
NODE_PATH=src
REACT_APP_ENV='stage'
REACT_APP_API_URL=http://api.ybit.stage.monospacelabs.com
REACT_APP_SITE_URL=http://ybit.stage.monospacelabs.com
REACT_APP_ADMIN_URL=http://admin.ybit.stage.monospacelabs.com
REACT_APP_APPARATUS_EMAIL_URL=http://ybit.stage.monospacelabs.com/login/:apparatus:
REACT_APP_APPARATUS_LINK_APPSTORE=https://itunes.apple.com/us/app/apparatus-app/id1317271136?ls=1&mt=8
REACT_APP_APPARATUS_LINK_GOOGLEPLAY=https://play.google.com/store/apps/details?id=com.apparatusapp
REACT_APP_BUGSNAG_KEY=9ed18e9f16b277d23b070e665adba8f6
REACT_APP_RELEASE_STAGE=staging

EOL
echo "Stage environment created"

elif [[ $1 == "development" ]];
	then
cat >.env <<EOL
NODE_PATH=src
REACT_APP_ENV='development'
REACT_APP_API_URL=http://api.ybit.$1.monospacelabs.com
REACT_APP_SITE_URL=
REACT_APP_ADMIN_URL=
REACT_APP_APPARATUS_EMAIL_URL=http://ybit.io/login/:apparatus:
REACT_APP_APPARATUS_LINK_APPSTORE=https://itunes.apple.com/us/app/apparatus-app/id1317271136?ls=1&mt=8
REACT_APP_APPARATUS_LINK_GOOGLEPLAY=https://play.google.com/store/apps/details?id=com.apparatusapp
REACT_APP_BUGSNAG_KEY=9ed18e9f16b277d23b070e665adba8f6
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_DATABASE_URL=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSSANGING_SENDER_ID=
REACT_APP_RELEASE_STAGE=development
EOL
echo "Dev environment created"

else
echo "ERROR: Build.sh command not found"
exit 1

fi
