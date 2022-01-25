# Action to compare tags of this and another repository

This action will compare the tags of another repository and this repository and will output the tags of the other repository not found in this one.

## Inputs

## `other-repo-name`

**Required** The name of the other repository.

## `other-repo-owner`

**Required** The GitHub owner of the other repository.

## Outputs

## `tags`

A json string of the tags that have been found in the other repository and not in this one.

## Example usage

For example trigger subsequent jobs by using the output as an input for a matrix.

```yaml
jobs:
  job_1:
    runs-on: ubuntu-latest
    steps:
      - name: Check tags in other repository
        uses: cvoegele/action-check-tags-in-another-repo@v1
        id: check
        with:
          other-repo-name: numpy
          other-repo-owner: numpy
    outputs: # propagate output of step to output of job
      matrix: ${{ steps.check.outputs.tags }}

  job_2:
    needs: job_1

    runs-on: ubuntu-latest
    strategy:
      matrix:
        tag: ${{ fromJson(needs.job_1.outputs.matrix) }} # parse output of job to matrix input

    steps:
      - name: Step0
        run: |
          echo from ${{ matrix.tag }}
```
