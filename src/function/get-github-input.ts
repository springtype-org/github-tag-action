import * as core from "@actions/core";

export interface IGithubEnvironment {
    ref: string;
    sha: string;
    repository: string;
    token: string;
}

/**
 * Get Github environment
 */
export const getGithubInput = (): IGithubEnvironment => {
    const missing: Array<string> = [];
    const {GITHUB_REF, GITHUB_SHA,GITHUB_REPOSITORY} = process.env;
    const token = core.getInput("github_token");
    if (!GITHUB_REF) {
        missing.push("GITHUB_REF");
    }
    if (!GITHUB_SHA) {
        missing.push("GITHUB_SHA");
    }
    if (!GITHUB_REPOSITORY) {
        missing.push("GITHUB_REPOSITORY");
    }
    if (!token) {
        missing.push("github_token");
    }
    if (missing.length > 0) {
        throw new Error(`Missing ${missing.join(' ')}`);
    }

    return {
        ref: GITHUB_REF as string,
        sha: GITHUB_SHA as string,
        repository: GITHUB_REPOSITORY as string,
        token: token,
    }
}

