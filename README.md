# Merge json files

This action is designed to merge 2 json files together. Intended to be used for Keyfactor store_types definitionsinpu

## Inputs

### `input-file`

**Required** The name of the file with data to be merged into another file. This will overwrite data if the same key exists

### `library-file`

**Required** The name of the master file to be combined with the data in 'input-file'

## Outputs

### `time`

For debugging purposes

## Example usage

```yaml
uses: keyfactor/action-merge-storetypes@v1.0
with:
	input-file: integ-store-types.json
	library-file: ./json-temp/store-types/store-types.json

```