import SmeeClient from "smee-client";
import { App, createNodeMiddleware } from "octokit";
import http from "http";
import dotenv from "dotenv";


dotenv.config();

const appId = process.env.GITHUB_APP_ID;

const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;
const privateKeyPath = process.env.PRIVATE_KEY_PATH;

const clientId = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;

if (!appId || !webhookSecret || !privateKeyPath || !clientId || !clientSecret) {
    throw new Error("Missing required environment variables");
}


const app = new App({
    appId: appId,
    oauth: {
        clientId: clientId,
        clientSecret: clientSecret,
    },
    webhooks: {
        secret: webhookSecret,
    },
    privateKey: privateKeyPath,

});

const webhookPort = 3005;
const webhookHost = "localhost";
const webhookPath = "/api/github/webhooks";


const smee = new SmeeClient({
    source: "https://smee.io/B7KkCV7BvQPyfmpW",
    target: `http://${webhookHost}:${webhookPort}${webhookPath}`,
    logger: console,
});



const main = async () => {

    try {
        console.log("Starting Webhook application");

  

        const events = await smee.start();

        events.on("message", (message: any) => {
            console.log("message received", message);
        }
        )

        app.webhooks.onAny(({ id, name, payload }) => {
            console.log(`Received event: ${name} with ID: ${id}`);
            console.log(JSON.stringify(payload, null, 2));
        });



        app.webhooks.on("issues.opened", async ({ octokit, payload }) => {
            console.log("New issue opened:", payload.issue.title);
            console.log(payload);

            return octokit.rest.issues.createComment({
                owner: payload.repository.owner.login,
                repo: payload.repository.name,
                issue_number: payload.issue.number,
                body: "Hello, World!",
            });
        });

        app.webhooks.on("issues.closed", async ({ octokit, payload }) => {
            console.log("Issue closed:", payload.issue.title);
        });

        app.webhooks.on("pull_request.opened", async ({ octokit, payload }) => {
            console.log("New PR opened:", payload.pull_request.title);

            try {

                await octokit.rest.issues.createComment({
                    owner: payload.repository.owner.login,
                    repo: payload.repository.name,
                    issue_number: payload.pull_request.number,
                    body: `## Pull Request Checklist
            - [ ] Code has been tested
            - [ ] Documentation has been updated
            - [ ] Changes have been reviewed
                
            Thank you for your contribution! 🚀`
                });
            } catch (error) {
                console.error("Error handling pull request:", error);
            }
        });

        app.webhooks.on("issues.reopened", async ({ octokit, payload }) => {
            console.log("Issue reopened:", payload.issue.title);
        }
        );
        
        app.webhooks.on("installation.created", async ({ octokit, payload }) => {
            console.log(payload);
        });

        app.webhooks.on("installation.deleted", async ({ octokit, payload }) => {
            console.log(payload);
        });

        app.webhooks.on("installation.suspend", async ({ octokit, payload }) => {
            console.log(payload);
        });

        app.webhooks.on("issue_comment.created", async ({ octokit, payload }) => {
            console.log("New comment on issue:", payload.issue.number);

            const comment = payload.comment.body.toLowerCase();
            if (comment.includes('/close')) {
                try {
                    await octokit.rest.issues.update({
                        owner: payload.repository.owner.login,
                        repo: payload.repository.name,
                        issue_number: payload.issue.number,
                        state: 'closed'
                    });
                    console.log("Issue closed via command");
                } catch (error) {
                    console.error("Error closing issue:", error);
                }
            }
        });
    } catch (error) {
        console.error("Error starting application:", error);
    }

};

const middleware = createNodeMiddleware(app);

const server = http.createServer((req, res) => {
    console.log(`Received request: ${req.method} ${req.url}`);


    if (req.url === webhookPath) {
        console.log("Received webhook event");



        middleware(req, res)
        return
    }

    res.statusCode = 404;
    res.end('Not found');
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

console.clear();
