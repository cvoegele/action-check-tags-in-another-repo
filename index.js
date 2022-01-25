import core from '@actions/core'
import github from '@actions/github'
import fetch from 'node-fetch'

async function fetchAsync(url) {
    let response = await fetch(url);
    return await response.text();
}

function getTagsOfOtherRepository(url) {
    let tags = []
    let result = fetchAsync(url)
    result.then(function (response) {

        const json = JSON.parse(response);
        for (let i = 0; i < json.length; i++) {
            const tag = json[i]
            tags.push(tag.name)
        }
    })
    return tags
}

function getTagsOfRepository(owner, repository) {
    return getTagsOfOtherRepository(`https://api.github.com/${owner}/${repository}/tags`)
}

try {

    const otherRepoName = core.getInput("other-repo-name");
    const otherRepoOwner = core.getInput("other-repo-owner");
    //test url
    let tagsOfOtherRepository = getTagsOfRepository(otherRepoOwner, otherRepoName)
    let tagsOfThisRepository = getTagsOfRepository(github.context.repo.owner, github.context.repo.repo)

    let tagsToProcess = tagsOfOtherRepository.filter(x => !tagsOfThisRepository.includes(x));
    let json = JSON.stringify(tagsToProcess);

    core.setOutput("tags", json)
} catch (error) {
    core.setFailed(error.message);
}
