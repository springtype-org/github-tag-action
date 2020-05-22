import {exec, IExecResponse} from "./promise-action-exec";
import {IGithubEnvironment} from "./get-github-input";
import {IActionInput} from "./get-action-input";

export interface ICommit {
    message: string;
}

export interface IPreviousTagAndCommitLogs {
    previousTag: string;
    commits: Array<ICommit>;
}


const SEPARATOR = "/#/SEPARATOR/#/";

const DEFAULT_PREVIOUS_TAG = "0.0.0";

const hasTags = async (): Promise<boolean> => {
    return await exec("git tag")
        .then(v => !!v.stdout.trim());
}

const sanitizeCommitLogs = (execResponse: IExecResponse): Array<ICommit> => {
    return execResponse.stdout
        .split(SEPARATOR)
        // for some reason the commits start with a `'` on the CI so we ignore it
        .map(x => x.trim().replace(/^'/g, ""))
        .filter(x => !!x)
        .map(x => {
            return {
                message: x
            }
        });
}
export const getPreviousTagAndCommitLogs = async (input: IActionInput & IGithubEnvironment): Promise<IPreviousTagAndCommitLogs> => {
    const currentBranchName = input.ref.replace("refs/heads/", "");

    const isPreRelease = input.releaseBranches
        .every((branch) => !currentBranchName.match(branch));

    if (isPreRelease) {
        throw new Error(`Branch ${currentBranchName}, is not an release branch (${input.releaseBranches.join(' ')})`);
    }

    //get all tags
    await exec("git fetch --tags");


    if (await hasTags()) {
        const previousTagSha = await exec("git rev-list --tags --topo-order --max-count=1")
            .then(v => v.stdout.trim());

        if (previousTagSha === input.sha) {
            throw new Error(`Previous tag ${previousTagSha} equal to current hash ${input.sha}`);
        }

        const previousTag = await exec(`git describe --tags ${previousTagSha}`)
            .then(v => v.stdout.trim());

        return {
            previousTag,
            commits: sanitizeCommitLogs(
                await exec(`git log ${previousTag}..HEAD --pretty=format:'%s%n%b${SEPARATOR}' --abbrev-commit`)
            )
        }
    } else {
        return {
            previousTag: DEFAULT_PREVIOUS_TAG,
            commits: sanitizeCommitLogs(
                await exec(`git log --pretty=format:'%s%n%b${SEPARATOR}' --abbrev-commit`)
            )
        }
    }
}