#!/usr/bin/env bash
npm run build
cp ../the-real-obama/build/libs/the-real-obama-1.0-SNAPSHOT-all.jar docker/service/service.jar
npx cdk synth
