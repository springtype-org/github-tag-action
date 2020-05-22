import * as core from "@actions/core";
import {exec} from "./function/promise-action-exec";
import {getActionInput} from "./function/get-action-input";
import {getGithubInput} from "./function/get-github-input";
import {getVersions} from "./function/get-versions";
import {createTag} from "./function/create-tag";


//IIFE ->  Immediately-invoked Function Expression
(async () => {
    try {

        const mergedInput = {...getActionInput(), ...getGithubInput()};

        const version = await getVersions(mergedInput);

        core.setOutput("previous_tag", version.previousTag);
        core.setOutput("new_tag", version.currentTag);
        core.setOutput("new_version", version.currentVersion);
        core.setOutput("changelog", version.changelog);

        const tagAlreadyExists = await exec(`git tag -l "${version.currentTag}"`).then(v => !!v.stdout.trim())

        if (tagAlreadyExists) {
            core.setFailed(`Tag (${version.currentTag}) already exist!`);
            return;
        }

        if (mergedInput.dryRun) {
            core.setFailed("Dry run: not performing tag action.");
            return;
        }
        await createTag(mergedInput, version);

    } catch (error) {
        core.setFailed(error.message);
    }
})();
