#!/usr/bin/env bash

out="./build"
package="./..."
package_name="download"
platforms=("windows/amd64" "windows/386" "darwin/amd64" "darwin/386" "linux/amd64" "linux/386")

for platform in "${platforms[@]}"
do
	platform_split=(${platform//\// })
	GOOS=${platform_split[0]}
	GOARCH=${platform_split[1]}
	output_name=$package_name'-'$GOOS'-'$GOARCH
	if [ $GOOS = "windows" ]; then
		output_name+='.exe'
	fi

	env GOOS=$GOOS GOARCH=$GOARCH go build -o $out/$output_name $package
	if [ $? -ne 0 ]; then
   		echo 'An error has occurred! Aborting the script execution...'
		exit 1
	fi
done

# for every file, generate the files hash and save to a text file
for file in $out/*
do
  sha256sum $file >> $out/sha256sum.txt
done

