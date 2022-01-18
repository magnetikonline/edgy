#!/bin/bash -e

DIRNAME=$(dirname "$0")


node "$DIRNAME/lib.test.js"
node "$DIRNAME/main-execute.test.js"
node "$DIRNAME/main-payloadverify.test.js"
node "$DIRNAME/main-property.test.js"
