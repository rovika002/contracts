#!/usr/bin/env bash


spinner() {
    chars="/-\|"

    for (( j=0; j< $1; j++ )); do
      for (( i=0; i<${#chars}; i++ )); do
        sleep 0.5
        echo -en "${chars:$i:1}" "\r"
      done
    done
}

spinner 2
echo "TwoKeyPlasmaEvents patch to version 1.0.4"
echo "TwoKeyPlasmaRegistry patch to version 1.0.1"

echo "Destination for execution: 0x8a84df5f7ed68f7087c9e3f54b49259c37726560"

cd ../..

python3 generate_bytecode.py upgradeContract TwoKeyPlasmaEvents 1.0.4
python3 generate_bytecode.py upgradeContract TwoKeyPlasmaRegistry 1.0.1
