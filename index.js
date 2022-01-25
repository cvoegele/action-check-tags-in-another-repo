import core from '@actions/core'
import github from '@actions/github'
import {XMLHttpRequest} from "xmlhttprequest";

function fetchAsync(url) {
    const request = new XMLHttpRequest();
    request.open('GET', url, false);  // `false` makes the request synchronous
    request.send(null);
    if (request.status === 200) {
        return request.responseText;
    }
}

function getTagsOfOtherRepository(url) {

    let response = fetchAsync(url)
    let tags = []
    const json = JSON.parse(response);
    for (let i = 0; i < json.length; i++) {
        const tag = json[i]
        tags.push(tag.name)
    }
    console.log(tags)
    return tags
}

function getTagsOfRepository(owner, repository) {
    const url = `https://api.github.com/repos/${owner}/${repository}/tags`;
    console.log(url)
    return getTagsOfOtherRepository(url)
}

try {

    const otherRepoName = core.getInput("other-repo-name");
    const otherRepoOwner = core.getInput("other-repo-owner");
    //test url
    let tagsOfOtherRepository = getTagsOfRepository(otherRepoOwner, otherRepoName)
    let tagsOfThisRepository = getTagsOfRepository(github.context.repo.owner, github.context.repo.repo)

    let tagsToProcess = tagsOfOtherRepository.filter(x => !tagsOfThisRepository.includes(x));
    let json = JSON.stringify(tagsToProcess);

    console.log(`The unprocessed tags are ${json}.`)

    core.setOutput("tags", json)
} catch (error) {
    core.setFailed(error.message);
}
