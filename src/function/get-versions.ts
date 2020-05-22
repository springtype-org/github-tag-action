import {getBumpType} from "./get-bump-type";
import {inc} from "semver";
import {IActionInput} from "./get-action-input";
import {getPreviousTagAndCommitLogs} from "./get-previous-tag-and-commit-logs";

import {IGithubEnvironment} from "./get-github-input";
import {getChangeLog, IChangeLog} from "./get-changelog";

export interface IVersion extends IChangeLog {
    changelog: string
}

export const getVersions = async (mergedInput: IActionInput & IGithubEnvironment): Promise<IVersion> => {

    const previousTagAndCommitLogs = await getPreviousTagAndCommitLogs(mergedInput);

    const bump = await getBumpType(previousTagAndCommitLogs.commits, mergedInput);
    const currentVersion = inc(previousTagAndCommitLogs.previousTag, bump) as string;

    const currentTag = `${mergedInput.tagPrefix}${currentVersion}`;

    const inputChangelog: IChangeLog = {
        previousTag: previousTagAndCommitLogs.previousTag,
        currentVersion,
        currentTag
    };

    return {...inputChangelog, changelog: await getChangeLog(
            previousTagAndCommitLogs.commits,
            inputChangelog,
            mergedInput
        )}
}