#!/bin/sh

npm run build

aws s3 rm s3://www.piratescsg.net/ --recursive --profile pirates-csg-admin

aws s3 cp build s3://www.piratescsg.net --recursive --profile pirates-csg-admin

