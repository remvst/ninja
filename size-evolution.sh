#!/bin/bash

IFS=$'\n' # make newlines the only separator
MAX_COMMITS=300

git checkout master

echo hash, message, date, size 1>size-evolution.csv

for COMMIT_LOG in $(git log --oneline --reverse | tail -n$MAX_COMMITS) ; do
    # Extract the hash
    COMMIT_HASH=$(echo $COMMIT_LOG | cut -d' ' -f1)
    COMMIT_MESSAGE=$(echo $COMMIT_LOG | cut -d' ' -f2-)
    COMMIT_DATE=$(git show -s --format=%ct $COMMIT_HASH)

    # Checkout that hash
    git checkout $COMMIT_HASH 1>/dev/null

    # Build
    make build 1>/dev/null

    # Check the size
    SIZE=$(stat -f%z build/game.zip)

    # Output
    echo $COMMIT_HASH, $COMMIT_MESSAGE, $COMMIT_DATE, $SIZE 1>>size-evolution.csv
done

git checkout master

exit 0
