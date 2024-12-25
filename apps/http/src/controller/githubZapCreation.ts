// while creating trigger we need to do OAuth for github, google to get the access token

import { Request, Response } from 'express';



export function installGithubApp(req: Request, res: Response): void {
    const installationUrl = `https://github.com/apps/InteliBridge/installations/new`;
    res.redirect(installationUrl);

}


export async function callbackGithubApp(req: Request, res: Response): Promise<void> {
    const { installation_id } = req.query;

    if (!installation_id) {
        res.status(400).send("Installation ID is missing");
        return;
    }

    console.log("Installation ID:", installation_id);

    res.status(200).send(`GitHub App installed! Installation ID: ${installation_id}`);

}