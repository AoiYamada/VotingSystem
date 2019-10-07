module.exports = {
    "apps": [{
        "name": "VotingSystem",
        "script": "server.js",
        "instance_var": "INSTANCE_ID",
        exec_mode: "cluster",
        instances: "max",
        "env": {
            "NODE_ENV": "uat",
        },
        "env_uat": {
            "NODE_ENV": "uat",
        },
        "env_prod": {
            "NODE_ENV": "prod",
        },
        "env_dev": {
            "NODE_ENV": "dev",
        }
    }]
}