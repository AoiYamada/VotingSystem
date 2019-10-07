define({ "api": [
  {
    "type": "get",
    "url": "/campaign/:campaign_uuid",
    "title": "Get Campaign List",
    "group": "Campaign",
    "description": "<p>Get Campaign List</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "page",
            "defaultValue": "0",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "limit",
            "defaultValue": "10",
            "description": "<p>rows per page</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Without Campaign Uuid": [
          {
            "group": "Without Campaign Uuid",
            "type": "Integer",
            "optional": false,
            "field": "count",
            "description": "<p>Total number of campaigns</p>"
          },
          {
            "group": "Without Campaign Uuid",
            "type": "String",
            "optional": false,
            "field": "next",
            "description": "<p>Url for getting next page's data with same limit</p>"
          },
          {
            "group": "Without Campaign Uuid",
            "type": "String",
            "optional": false,
            "field": "prev",
            "description": "<p>Url for getting previous page's data with same limit</p>"
          },
          {
            "group": "Without Campaign Uuid",
            "type": "<a href=\"#api-_Custom_types-ObjectCampaign\">Campaign[]</a>",
            "optional": false,
            "field": "rows",
            "description": ""
          }
        ],
        "With Campaign Uuid": [
          {
            "group": "With Campaign Uuid",
            "type": "<a href=\"#api-_Custom_types-ObjectCampaign\">Campaign</a>",
            "optional": false,
            "field": "Campaign",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Without-Campaign-Uuid:",
          "content": "HTTP/1.1 200 OK\n{\n    \"count\": 2,\n    \"rows\": [\n        {\n            \"id\": \"aefcd022-055b-4794-8319-ed21d23e4bc4\",\n            \"title\": \"MyCampaign\",\n            \"start_time\": 1569741708823,\n            \"end_time\": 1569741795223,\n            \"options\": [\n                \"Option, 01\",\n                \"Option, 02\",\n                \"Option, 03\"\n            ]\n        },\n        {\n            \"id\": \"ec0687f5-945d-4f2b-9533-0a4880f0e160\",\n            \"title\": \"MyCampaign2\",\n            \"start_time\": 1569741622423,\n            \"end_time\": 1569741708823,\n            \"options\": [\n                \"Option, 01\",\n                \"Option, 02\",\n                \"Option, 03\"\n            ]\n        }\n    ]\n}",
          "type": "json"
        },
        {
          "title": "With-Campaign-Uuid:",
          "content": "HTTP/1.1 200 OK\n{\n    \"id\": \"aefcd022-055b-4794-8319-ed21d23e4bc4\",\n    \"title\": \"MyCampaign\",\n    \"start_time\": 1569741708823,\n    \"end_time\": 1569741795223,\n    \"options\": [\n        \"Option, 01\",\n        \"Option, 02\",\n        \"Option, 03\"\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx/5xx": [
          {
            "group": "Error 4xx/5xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Description of the error</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n    \"message\": \"Something about the error\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/campaign/get.js",
    "groupTitle": "Campaign",
    "name": "GetCampaignCampaign_uuid",
    "sampleRequest": [
      {
        "url": "http://localhost:3000/campaign/:campaign_uuid"
      }
    ]
  },
  {
    "type": "get",
    "url": "/list",
    "title": "Get Active Campaign List",
    "group": "Campaign",
    "description": "<p>A list to display all voting campaign. i- display campaigns within start/end time first and order by total no. of votes. ii- display most recent ended campaign afterward. There is around 10 mins delay about the vote count.</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Uuid of the campaign created</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "start_time",
            "description": "<p>YYYY-MM-DD HH:mm:ss</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "end_time",
            "description": "<p>YYYY-MM-DD HH:mm:ss</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Candidates with votes</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "total_votes",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n    {\n        \"id\": \"ae78c0a4-1183-40b5-b601-0df5b8405194\",\n        \"title\": \"Test3\",\n        \"start_time\": \"2019-09-29 15:55:42\",\n        \"end_time\": \"2022-11-30 01:44:02\",\n        \"options\": {\n            \"A\": 1,\n            \"B\": 0\n        },\n        \"total_votes\": 1\n    }\n]",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx/5xx": [
          {
            "group": "Error 4xx/5xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Description of the error</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n    \"message\": \"Something about the error\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/list/get.js",
    "groupTitle": "Campaign",
    "name": "GetList",
    "sampleRequest": [
      {
        "url": "http://localhost:3000/list"
      }
    ]
  },
  {
    "type": "post",
    "url": "/campaign",
    "title": "Create Campaign",
    "group": "Campaign",
    "description": "<p>Create Campaign</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "start_time",
            "description": "<p>Unix Timestamp</p>"
          },
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "end_time",
            "description": "<p>Unix Timestamp</p>"
          },
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": false,
            "field": "options",
            "description": "<p>Candidates</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<a href=\"#api-_Custom_types-ObjectCampaign\">Campaign</a>",
            "optional": false,
            "field": "Campaign",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"id\": \"dc870fb8-63a9-4be2-87e6-7ff8cde88f14\",\n    \"title\": \"Test3\",\n    \"start_time\": 1569747525631,\n    \"end_time\": 1569847525631,\n    \"options\": [\n        \"A1\",\n        \"B2\"\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx/5xx": [
          {
            "group": "Error 4xx/5xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Description of the error</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n    \"message\": \"Something about the error\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/campaign/post.js",
    "groupTitle": "Campaign",
    "name": "PostCampaign",
    "sampleRequest": [
      {
        "url": "http://localhost:3000/campaign"
      }
    ]
  },
  {
    "type": "get",
    "url": "/vote/:campaign_uuid",
    "title": "Get Votes of a campaign",
    "group": "Vote",
    "description": "<p>Get Votes of a campaign</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "hkid",
            "description": "<p>If the hkid is used to vote, the result will indicate the choice</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "votes",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "votes.candidate_X",
            "description": "<p>Vote of the candidate_X</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "your_vote",
            "description": "<p>The candidate the hkid voted(if voted)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Not-Vote:",
          "content": "HTTP/1.1 200 OK\n{\n    \"votes\": {\n        \"A\": 0,\n        \"B\": 0\n    }\n}",
          "type": "String"
        },
        {
          "title": "Success-Voted:",
          "content": "HTTP/1.1 200 OK\n{\n    \"votes\": {\n        \"A1\": 1,\n        \"B2\": 0\n    },\n    \"your_vote\": \"A1\"\n}",
          "type": "String"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx/5xx": [
          {
            "group": "Error 4xx/5xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Description of the error</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n    \"message\": \"Something about the error\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/vote/get.js",
    "groupTitle": "Vote",
    "name": "GetVoteCampaign_uuid",
    "sampleRequest": [
      {
        "url": "http://localhost:3000/vote/:campaign_uuid"
      }
    ]
  },
  {
    "type": "post",
    "url": "/vote/:campaign_uuid",
    "title": "Vote a candidate",
    "group": "Vote",
    "description": "<p>Vote a candidate</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "hkid",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "option",
            "description": ""
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "String"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx/5xx": [
          {
            "group": "Error 4xx/5xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Description of the error</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n    \"message\": \"Something about the error\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/vote/post.js",
    "groupTitle": "Vote",
    "name": "PostVoteCampaign_uuid",
    "sampleRequest": [
      {
        "url": "http://localhost:3000/vote/:campaign_uuid"
      }
    ]
  },
  {
    "type": "OBJECT",
    "url": "Campaign",
    "title": "Campaign",
    "description": "<p>This is a hack for creating custom data types in apidoc, not an api.</p>",
    "group": "_Custom_types",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Uuid of the campaign created</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "start_time",
            "description": "<p>Unix Timestamp</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "end_time",
            "description": "<p>Unix Timestamp</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "options",
            "description": "<p>Candidates</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/campaign/_CustomTypes.js",
    "groupTitle": "_Custom_types",
    "name": "ObjectCampaign",
    "sampleRequest": [
      {
        "url": "http://localhost:3000Campaign"
      }
    ]
  }
] });
