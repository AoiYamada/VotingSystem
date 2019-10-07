# Socket API

## Connection

To subscribe the Votes of a list of Campaigns by their uuids.

#### Params

|         key          |  type  |                        description                        |
| :------------------: | :----: | :-------------------------------------------------------: |
|        query         | Object |                                                           |
| query.campaign_uuids | String | A JSON stringified Array of Strings contains Campaign IDs |

#### Example

```js
const socket = io("ws://localhost", {
  query: {
    campaign_uuids: JSON.stringify(["8d56eaa6-35ca-4817-8cb7-e94c706ad237", "92f3736a-d169-4cec-b02c-2ba4c0482e72"]),
  },
});
```

---

## Event

### On Vote

Recieve the Votes' status of a campaign

#### Params

|                key                |  type   |                              description                               |
| :-------------------------------: | :-----: | :--------------------------------------------------------------------: |
|             response              | Object  |                                  JSON                                  |
|      response.campaign_uuid       | String  |                              Campaign ID                               |
|         response.options          | Object  | A Object contains Campaign options as key and number of votes as value |
| response.options.example_option_1 | Integer |                            Number of votes                             |

#### Example

```js
socket.on("vote", ({ campaign_uuid, options }) => {
  console.log(campaign_uuid);
  // 92f3736a-d169-4cec-b02c-2ba4c0482e72

  console.log(options);
  /*
   * {
   *	 example_option_1: 17
   * }
   */
});
```

### Subscribe Campaigns

Subscribe more Campaigns by Ccampaign uuids

#### Params

|        key         |  type  |               description                |
| :----------------: | :----: | :--------------------------------------: |
| new_campaign_uuids | String | JSON stringified array of campaign uuids |

#### Example

```js
socket.emit("subscribe", new_campaign_uuids);
```
