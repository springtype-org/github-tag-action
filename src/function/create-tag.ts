import {context, GitHub} from "@actions/github";
import * as core from "@actions/core";
import {IGithubEnvironment} from "./get-github-input";
import {IActionInput} from "./get-action-input";
import {IVersion} from "./get-versions";

export const createTag = async (mergedInput: IGithubEnvironment & IActionInput, version: IVersion) => {

    const gitClient = new GitHub(mergedInput.token).git;
    let tagSha = mergedInput.sha;

    if (mergedInput.createAnnotatedTag) {
        core.debug(`Creating annotated tag`);

        const tagCreateResponse = await gitClient.createTag({
            ...context.repo,
            tag: version.currentTag,
            message: version.currentTag,
            object: mergedInput.sha,
            type: "commit",
        });

        tagSha = tagCreateResponse.data.sha;
    }

    core.debug(`Pushing new tag to the repo`);

    await gitClient.createRef({
        ...context.repo,
        ref: `refs/tags/${version.currentTag}`,
        sha: tagSha,
    });
}