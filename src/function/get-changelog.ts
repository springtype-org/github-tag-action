import {generateNotes} from "@semantic-release/release-notes-generator";
import {ICommit} from "./get-previous-tag-and-commit-logs";
import {IGithubEnvironment} from "./get-github-input";

export interface IChangeLog {
    previousTag: string;
    currentTag: string;
    currentVersion: string;
}

export const getChangeLog = async (commits: Array<ICommit>, input: IChangeLog, inputEnv: IGithubEnvironment): Promise<string> => {
    return await generateNotes(
        {},
        {
            commits,
            logger: {log: console.info.bind(console)},
            options: {
                repositoryUrl: `https://github.com/${inputEnv.repository}`,
            },
            lastRelease: {gitTag: input.previousTag},
            nextRelease: {gitTag: input.currentTag, version: input.currentVersion},
        }
    );
}