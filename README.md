# OGMA

A reverse engineering of `.proto` files for calling the gRPC services of a popular authentic social network.

## Roadmap

- [x] `public.activity.v2.ActivityService/GetActivityFeed`
- [x] `public.activity.v2.ActivityService/MarkActivitiesAsSeen`
- [ ] `public.entity.v2.UserService/GetUserProfile`
- [x] `public.home.v2.StateService/GetMyState`
- [ ] `public.memories.v2.MemoriesService/GetMemoriesFeed`
- [ ] `public.pprofile.v2.PublicProfileService/GetFriendsWhoFollowTarget`
- [ ] `public.relationship.v2.RelationshipService/CreateRelationship`
- [ ] `public.relationship.v2.RelationshipService/DeleteRelationship`
- [ ] `public.relationship.v2.RelationshipService/GetUserRelationships`
- [ ] `public.relationship.v2.RelationshipService/ListRelationships`
- [ ] `public.story.v2.StoryService/GetMyStories`
- [ ] `public.story.v2.StoryService/GetMyStoryActivity`
- [ ] `public.discovery.v2.FeedDiscoveryV2Service/GetFeedV2`
- [ ] `public.entity.v2.PostService/CreatePostLike`
- [ ] `public.entity.v2.PostService/DeletePostLike`
- [ ] `public.entity.v2.PostService/GetPosts`
- [ ] `public.entity.v2.PostService/SetPostsAsPublic`
- [ ] `public.home.v2.FeedService/GetHomeFeed`
- [ ] `public.home.v2.FeedService/GetWhatYouMissed`
- [ ] `public.home.v2.FeedService/MarkPostsAsSeen`
- [ ] `public.topic.v2.UserInterestService/GetContentTaxonomy`
- [ ] `public.topic.v2.UserInterestService/GetUserInterest`
- [ ] `public.topic.v2.UserInterestService/PutUserInterest`
- [ ] `public.topic.v2.TopicService/SearchTopics`
- [ ] `chat.core.v1.ChatCoreService/ViewInviteLink`
- [ ] `chat.core.v1.ChatCoreService/AcceptConversation`
- [ ] `chat.core.v1.ChatCoreService/ClearConversation`
- [ ] `chat.core.v1.ChatCoreService/CreateConversation`
- [ ] `chat.core.v1.ChatCoreService/CreateInvites`
- [ ] `chat.core.v1.ChatCoreService/GetConversationFeed`
- [ ] `chat.core.v1.ChatCoreService/GetConversationsById`
- [ ] `chat.core.v1.ChatCoreService/GetInviteLink`
- [ ] `chat.core.v1.ChatCoreService/GetMessages`
- [ ] `chat.core.v1.ChatCoreService/GetPendingInvites`
- [ ] `chat.core.v1.ChatCoreService/GetSentInvites`
- [ ] `chat.core.v1.ChatCoreService/HandleInvite`
- [ ] `chat.core.v1.ChatCoreService/JoinByInviteLink`
- [ ] `chat.core.v1.ChatCoreService/ResetInviteLink`
- [ ] `chat.core.v1.ChatCoreService/SendMessage`
- [ ] `chat.core.v1.ChatCoreService/TriggerMoment`
- [ ] `chat.core.v1.ChatCoreService/UpdateConversation`
- [ ] `chat.core.v1.ChatCoreService/UpdateMessage`
- [ ] `chat.core.v1.ChatCoreService/UpdateUserPrefs`
- [ ] `media.upload.v1.MediaUploadService/CreateUploadUrls`
- [ ] `contacts.core.v1.ContactsService/Delete`
- [ ] `contacts.core.v1.ContactsService/GetMatchedFriends`
- [ ] `contacts.core.v1.ContactsService/GetSuggestions`
- [ ] `contacts.core.v1.ContactsService/Upload`
- [ ] `officialaccounts.discovery.v1.DiscoveryService/GetRecommendations`
- [ ] `officialaccounts.feed.v1.FeedService/GetOAActivityFeed`
- [ ] `officialaccounts.feed.v1.FeedService/GetOAFanFeed`
- [ ] `officialaccounts.feed.v1.FeedService/GetOAProfileFeed`
- [ ] `officialaccounts.feed.v1.FeedService/GetPostMetrics`
- [ ] `officialaccounts.relationships.v1.RelationshipsService/DisablePostNotifications`
- [ ] `officialaccounts.relationships.v1.RelationshipsService/EnablePostNotifications`
- [ ] `officialaccounts.relationships.v1.RelationshipsService/Follow`
- [ ] `officialaccounts.relationships.v1.RelationshipsService/GetAllFollowing`
- [ ] `officialaccounts.relationships.v1.RelationshipsService/GetCommentsByStatus`
- [ ] `officialaccounts.relationships.v1.RelationshipsService/GetFollowerStatus`
- [ ] `officialaccounts.relationships.v1.RelationshipsService/GetFriendsFollowingOA`
- [ ] `officialaccounts.relationships.v1.RelationshipsService/GetPostNotificationStatus`
- [ ] `officialaccounts.relationships.v1.RelationshipsService/Unfollow`
- [ ] `relationship.contactinvites.v1.ContactinvitesService/Create`
- [ ] `feed.discovery.v1.FeedDiscoveryService/FeedInteraction`
- [ ] `feed.discovery.v1.FeedDiscoveryService/GetPublicPosts`
- [ ] `feed.discovery.v1.FeedDiscoveryService/PostSeen`
- [ ] `search.frontend.v1.SearchService/OASearch`
- [ ] `search.frontend.v1.SearchService/SearchUsers`
- [ ] `unlockable.v1.UnlockableService/DismissEducation`
- [ ] `realtime.core.v1.RealTimeStreamService/Stream`

## Generating a `.desc` file

```bash
protoc --proto_path=proto --descriptor_set_out=ogma.desc \
  proto/public/**/*.proto \
  proto/common/**/*.proto
```

You'll be able to use the `ogma.desc` file with any tool that supports it.

## Contributing

You may need the following tools.

- [`protoc`](https://protobuf.dev/installation/) for decoding known and compiling protobuf files
- [`decode_raw`](https://github.com/confio/decode_raw) for decoding unknown protobuf files with syntax highlighting
- [`bun`](https://bun.sh/) for running scripts in this repository

Once done, you can install the dependencies using `bun install`.

### Usage of `decode.mts`

You first need a raw request or response from the service and you should put it in the `bins/` directory (`mkdir bins` if none exists).

If the message you want to decode is already in the `proto/` directory, you can decode it using the following command.

```bash
bun decode.mts bins/SearchUsersResponse.bin search.frontend.v1.SearchService/SearchUsersResponse
```

However, if you're willing to contribute and your message is not in the `proto/` directory, you can raw decode it using the following command.

```bash
bun decode.mts bins/UnknownMessageResponse.bin
```

It'll print the raw protobuf message in the terminal for easier debugging, we won't elaborate on how to retrieve the proper fields from the raw message, do as you wish.
