import * as core from "@actions/core";
import {ReleaseType} from "semver";

export interface IActionInput {
    defaultBump: ReleaseType;
    tagPrefix: string;
    releaseBranches: Array<string>;
    createAnnotatedTag: boolean;
    updatePackageJson: boolean;
    dryRun: boolean;
}

const DEFAULT_TAG_PREFIX = 'v';
const DEFAULT_RELEASE_BRANCH = 'master';

const getDefaultBump = (): ReleaseType => {
    const defaultBump = core.getInput("default_bump");
    switch (defaultBump) {
        case 'major':
            return 'major';
        case 'premajor':
            return 'premajor';
        case 'minor':
            return 'minor';
        case 'preminor':
            return 'preminor';
        case 'prepatch':
            return 'prepatch';
        case 'prerelease':
            return 'prerelease';
        case 'patch':
            return 'patch';
        default:
            core.warning(`Unknown default bump version ${defaultBump}`)
            return 'patch';
    }
}

const getDefaultReleaseBranch = (): Array<string> => {
    return (core.getInput("release_branches") || DEFAULT_RELEASE_BRANCH)
        .split(',')
        .filter(v => !!v);
}

export const getActionInput = (): IActionInput => {
    return {
        defaultBump: getDefaultBump(),
        releaseBranches: getDefaultReleaseBranch(),
        tagPrefix: core.getInput("tag_prefix") || DEFAULT_TAG_PREFIX,
        createAnnotatedTag: core.getInput("create_annotated_tag") === "true",
        updatePackageJson: core.getInput("update_package_json") === "true",
        dryRun: core.getInput("dry_run") === "true",
    }
}

