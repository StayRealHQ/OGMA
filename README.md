# OGMA

A reverse engineering of `.proto` files for calling the gRPC services of a popular authentic social network.

<details>
  <summary>Roadmap</summary>

- [ ] `chat.core.v1.ChatCoreService/SendMessage`
- [ ] `chat.core.v1.ChatCoreService/GetMessages`
- [ ] `chat.core.v1.ChatCoreService/UpdateMessage`
- [ ] `chat.core.v1.ChatCoreService/CreateConversation`
- [ ] `chat.core.v1.ChatCoreService/AcceptConversation`
- [ ] `chat.core.v1.ChatCoreService/UpdateConversation`
- [ ] `chat.core.v1.ChatCoreService/ClearConversation`
- [ ] `chat.core.v1.ChatCoreService/GetConversationFeed`
- [ ] `chat.core.v1.ChatCoreService/GetConversationsById`
- [ ] `chat.core.v1.ChatCoreService/TriggerMoment`
- [ ] `chat.core.v1.ChatCoreService/GetUserPrefs`
- [ ] `chat.core.v1.ChatCoreService/UpdateUserPrefs`
- [ ] `chat.core.v1.ChatCoreService/RankConversation`
- [ ] `chat.core.v1.ChatCoreService/CreateInvite`
- [ ] `chat.core.v1.ChatCoreService/CreateInvites`
- [ ] `chat.core.v1.ChatCoreService/HandleInvite`
- [ ] `chat.core.v1.ChatCoreService/GetPendingInvites`
- [ ] `chat.core.v1.ChatCoreService/GetSentInvites`
- [ ] `chat.core.v1.ChatCoreService/ResetInviteLink`
- [ ] `chat.core.v1.ChatCoreService/GetInviteLink`
- [ ] `chat.core.v1.ChatCoreService/ViewInviteLink`
- [ ] `chat.core.v1.ChatCoreService/JoinByInviteLink`

- [x] `media.upload.v1.MediaUploadService/CreateUploadUrls`

- [ ] `realtime.core.v1.RealTimeStreamService/Stream`
- [ ] `realtime.core.v1.RealTimeRouterService/Send`

- [x] `public.activity.v2.ActivityService/GetActivityFeed`
- [x] `public.activity.v2.ActivityService/MarkActivitiesAsSeen`

- [x] `public.discovery.v2.FeedDiscoveryV2Service/GetFeedV2`

- [ ] `public.entity.v2.UserService/GetUsers` (unavailable)
- [x] `public.entity.v2.UserService/GetUserProfile`
- [ ] `public.entity.v2.UserService/SetAstroSign` (unavailable)

- [x] `public.entity.v2.PostService/GetPosts`
- [ ] `public.entity.v2.PostService/DeletePostRealmoji` (unavailable)
- [ ] `public.entity.v2.PostService/CreatePostRealmoji` (unavailable)
- [ ] `public.entity.v2.PostService/CreatePostComment` (unavailable)
- [x] `public.entity.v2.PostService/SetPostsAsPublic`
- [x] `public.entity.v2.PostService/CreatePostLike`
- [x] `public.entity.v2.PostService/DeletePostLike`
- [ ] `public.entity.v2.PostService/CreateCommentReaction` (unavailable)
- [ ] `public.entity.v2.PostService/DeleteCommentReaction` (unavailable)
- [ ] `public.entity.v2.PostService/GetUserCommentReactions` (unavailable)
- [ ] `public.entity.v2.PostService/GetNbCommentReactions` (unavailable)

- [x] `public.home.v2.FeedService/GetHomeFeed`
- [x] `public.home.v2.FeedService/MarkPostsAsSeen`
- [x] `public.home.v2.FeedService/GetWhatYouMissed`

- [x] `public.home.v2.StateService/GetMyState`

- [ ] `public.location.v2.PlacesService/SearchPlaces`

- [ ] `public.media.v2.MediaService/CreateUploadUrls` (unavailable)

- [x] `public.memories.v2.MemoriesService/GetMemoriesFeed`
- [x] `public.memories.v2.MemoriesService/GetTopMemories`

- [ ] `public.pprofile.v2.PublicProfileService/GetFriendsWhoFollowTarget`

- [x] `public.relationship.v2.RelationshipService/GetUserRelationships`
- [x] `public.relationship.v2.RelationshipService/CreateRelationship`
- [x] `public.relationship.v2.RelationshipService/DeleteRelationship`
- [x] `public.relationship.v2.RelationshipService/ListRelationships`

- [x] `public.story.v2.StoryService/GetMyStories`
- [x] `public.story.v2.StoryService/GetMyStoryActivity`

- [ ] `public.topic.v2.TopicService/SearchTopics`
- [ ] `public.topic.v2.TopicService/GetExploreFeed`

- [ ] `public.topic.v2.UserInterestService/GetUserInterest`
- [ ] `public.topic.v2.UserInterestService/PutUserInterest`
- [ ] `public.topic.v2.UserInterestService/GetContentTaxonomy`

- [ ] `contacts.core.v1.ContactsService/Delete`
- [ ] `contacts.core.v1.ContactsService/GetMatchedFriends`
- [ ] `contacts.core.v1.ContactsService/GetSuggestions`
- [ ] `contacts.core.v1.ContactsService/HideSuggestions`
- [ ] `contacts.core.v1.ContactsService/Upload`

- [ ] `entity.user.v1.UserService/GetOAUsers`
- [ ] `entity.user.v1.UserService/GetUser`
- [ ] `entity.user.v1.UserService/GenUsernames`
- [ ] `entity.user.v1.UserService/GetUserBasicInfo`
- [ ] `entity.user.v1.UserService/GetUserBasicInfoBatch`
- [ ] `entity.user.v1.UserService/UserExists`
- [ ] `entity.user.v1.UserService/CreateUser`
- [ ] `entity.user.v1.UserService/UpdateUser`
- [ ] `entity.user.v1.UserService/UpdateUserActivity`
- [ ] `entity.user.v1.UserService/GetUserActivity`
- [ ] `entity.user.v1.UserService/DeleteUser`
- [ ] `entity.user.v1.UserService/SearchUsers`
- [ ] `entity.user.v1.UserService/FindUsersByUsername`
- [ ] `entity.user.v1.UserService/InsertUser`
- [ ] `entity.user.v1.UserService/InsertUserRealmoji`
- [ ] `entity.user.v1.UserService/AddUserRealmoji`
- [ ] `entity.user.v1.UserService/DisableUserRealmoji`
- [ ] `entity.user.v1.UserService/DeleteUserRealmoji`
- [ ] `entity.user.v1.UserService/UserRealmojiExists`
- [ ] `entity.user.v1.UserService/GetUserRealmojis`
- [ ] `entity.user.v1.UserService/GetStreak`
- [ ] `entity.user.v1.UserService/GetStreaks`
- [ ] `entity.user.v1.UserService/UpdateStreak`

- [ ] `feed.discovery.v1.FeedDiscoveryService/GetFeed`
- [ ] `feed.discovery.v1.FeedDiscoveryService/FeedInteraction`
- [ ] `feed.discovery.v1.FeedDiscoveryService/PostSeen`
- [ ] `feed.discovery.v1.FeedDiscoveryService/ResetSeenPosts`
- [ ] `feed.discovery.v1.FeedDiscoveryService/GetPublicPosts`

- [ ] `entity.event.v1.EventService/CreateEvent`
- [ ] `entity.event.v1.EventService/GetEvent`
- [ ] `entity.event.v1.EventService/UpdateEvent`
- [ ] `entity.event.v1.EventService/DeleteEvent`
- [ ] `entity.event.v1.EventService/GetAllEvents`
- [ ] `entity.event.v1.EventService/CreateVenue`
- [ ] `entity.event.v1.EventService/GetVenue`
- [ ] `entity.event.v1.EventService/UpdateVenue`
- [ ] `entity.event.v1.EventService/DeleteVenue`
- [ ] `entity.event.v1.EventService/GetAllVenues`

- [ ] `entity.post.v1.PostService/GetPost`
- [ ] `entity.post.v1.PostService/GetPosts`
- [ ] `entity.post.v1.PostService/GetPostInteractions`
- [ ] `entity.post.v1.PostService/GetPostInteractionCounts`
- [ ] `entity.post.v1.PostService/GetUserInteractions`
- [ ] `entity.post.v1.PostService/GetCommentsByStatus`

- [ ] `entity.post.v1.UnifiedPostService/GetUnifiedPost`
- [ ] `entity.post.v1.UnifiedPostService/GetUnifiedPosts`
- [ ] `entity.post.v1.UnifiedPostService/CreateUnifiedPost`
- [ ] `entity.post.v1.UnifiedPostService/DeleteUnifiedPost`
- [ ] `entity.post.v1.UnifiedPostService/RestoreUnifiedPost`
- [ ] `entity.post.v1.UnifiedPostService/UpdateUnifiedPost`
- [ ] `entity.post.v1.UnifiedPostService/GetUnifiedPostsOfUser`
- [ ] `entity.post.v1.UnifiedPostService/DeleteUserData`
- [ ] `entity.post.v1.UnifiedPostService/CreateUnifiedPostRealmoji`
- [ ] `entity.post.v1.UnifiedPostService/GetUnifiedPostRealmojis`
- [ ] `entity.post.v1.UnifiedPostService/DeleteUnifiedPostRealmoji`
- [ ] `entity.post.v1.UnifiedPostService/CreateUnifiedPostComment`
- [ ] `entity.post.v1.UnifiedPostService/DeleteUnifiedPostComment`
- [ ] `entity.post.v1.UnifiedPostService/GetUnifiedPostComments`
- [ ] `entity.post.v1.UnifiedPostService/CreateUnifiedPostTag`
- [ ] `entity.post.v1.UnifiedPostService/DeleteUnifiedPostTag`
- [ ] `entity.post.v1.UnifiedPostService/GetUnifiedPostTags`
- [ ] `entity.post.v1.UnifiedPostService/CreateUnifiedPostScreenshot`
- [ ] `entity.post.v1.UnifiedPostService/GetUnifiedPostScreenshots`

- [ ] `event.frontend.v1.EventViewService/GetMainEventView`

- [ ] `event.frontend.v1.EventMembershipService/JoinEvent`
- [ ] `event.frontend.v1.EventMembershipService/LeaveEvent`
- [ ] `event.frontend.v1.EventMembershipService/UpdateEventLocation`

- [ ] `event.frontend.v1.EventFeedService/GetOfficialFeed`
- [ ] `event.frontend.v1.EventFeedService/GetOwnAndFriendsFeed`
- [ ] `event.frontend.v1.EventFeedService/GetOnsiteFeed`
- [ ] `event.frontend.v1.EventFeedService/GetOffsiteFeed`
- [ ] `event.frontend.v1.EventFeedService/GetEveryoneFeed`

- [ ] `event.frontend.v1.EventSearchService/GetAllEvents`

- [ ] `event.frontend.v1.EventPostService/CreatePost`
- [ ] `event.frontend.v1.EventPostService/DeletePost`

- [ ] `event.frontend.v1.EventAdminService/CreateEvent`
- [ ] `event.frontend.v1.EventAdminService/DeleteEvent`
- [ ] `event.frontend.v1.EventAdminService/TriggerNotification`

- [ ] `officialaccounts.discovery.v1.DiscoveryService/GetRecommendations`
- [ ] `officialaccounts.discovery.v1.DiscoveryService/GetAll`

- [ ] `officialaccounts.feed.v1.FeedService/GetMentionsFeed`
- [ ] `officialaccounts.feed.v1.FeedService/GetRankedMentionsFeed`
- [ ] `officialaccounts.feed.v1.FeedService/GetActivityFeed`
- [ ] `officialaccounts.feed.v1.FeedService/GetOAProfileFeed`
- [ ] `officialaccounts.feed.v1.FeedService/GetOAFanFeed`
- [ ] `officialaccounts.feed.v1.FeedService/GetOAActivityFeed`
- [ ] `officialaccounts.feed.v1.FeedService/GetPostMetrics`
- [ ] `officialaccounts.feed.v1.FeedService/GetOAPost`
- [ ] `officialaccounts.feed.v1.FeedService/GetOARecommendationsFeed`
- [ ] `officialaccounts.feed.v1.FeedService/GetFanFeed`
- [ ] `officialaccounts.feed.v1.FeedService/GetEngagementMetrics`

- [ ] `officialaccounts.feed.v1.ViewService/GetOAProfileView`

- [ ] `officialaccounts.relationships.v1.RelationshipsService/Follow`
- [ ] `officialaccounts.relationships.v1.RelationshipsService/Unfollow`
- [ ] `officialaccounts.relationships.v1.RelationshipsService/EnablePostNotifications`
- [ ] `officialaccounts.relationships.v1.RelationshipsService/DisablePostNotifications`
- [ ] `officialaccounts.relationships.v1.RelationshipsService/GetPostNotificationStatus`
- [ ] `officialaccounts.relationships.v1.RelationshipsService/GetAllFollowing`
- [ ] `officialaccounts.relationships.v1.RelationshipsService/GetFollowerStatus`
- [ ] `officialaccounts.relationships.v1.RelationshipsService/GetFollowerCount`
- [ ] `officialaccounts.relationships.v1.RelationshipsService/GetFriendsFollowingOA`
- [ ] `officialaccounts.relationships.v1.RelationshipsService/GetCommentsByStatus`

- [ ] `officialaccounts.settings.v1.OfficialAccountsSettingsService/GetOfficialAccountSettings`
- [ ] `officialaccounts.settings.v1.OfficialAccountsSettingsService/UpdateOfficialAccountSettings`

- [ ] `relationship.contactinvites.v1.ContactinvitesService/Create`
- [ ] `relationship.contactinvites.v1.ContactinvitesService/CreateMany`
- [ ] `relationship.contactinvites.v1.ContactinvitesService/List`
- [ ] `relationship.contactinvites.v1.ContactinvitesService/ListDormantFriends`
- [ ] `relationship.contactinvites.v1.ContactinvitesAdminService/Create`
- [ ] `relationship.contactinvites.v1.ContactinvitesAdminService/GetByExternalId`
- [ ] `relationship.contactinvites.v1.ContactinvitesAdminService/List`
- [ ] `relationship.contactinvites.v1.ContactinvitesAdminService/DeleteByUserId`
- [ ] `relationship.contactinvites.v1.ContactinvitesAdminService/Update`

- [ ] `relationship.friendrequest.v1.FriendRequestService/CreateFriendRequest`
- [ ] `relationship.friendrequest.v1.FriendRequestService/GetEdges`

- [ ] `relationship.friends.v1.FriendsService/AreFriends`
- [ ] `relationship.friends.v1.FriendsService/IsFriendWith`

- [ ] `relationship.frontend.v1.RelationshipService/GetUserRelationships`

- [ ] `relationship.graph.v1.RelationshipService/GetEdge`
- [ ] `relationship.graph.v1.RelationshipService/GetEdges`
- [ ] `relationship.graph.v1.RelationshipService/ListEdges`
- [ ] `relationship.graph.v1.RelationshipService/AddEdgeAndInverse`
- [ ] `relationship.graph.v1.RelationshipService/RemoveInverseEdge`
- [ ] `relationship.graph.v1.RelationshipService/RemoveEdgeAndInverse`
- [ ] `relationship.graph.v1.RelationshipService/VertexCount`
- [ ] `relationship.graph.v1.RelationshipService/AsyncRemoveVertex`
- [ ] `relationship.graph.v1.RelationshipService/SetEdgeState`
- [ ] `relationship.graph.v1.RelationshipService/AdminAddEdgeAndInverse`
- [ ] `relationship.graph.v1.RelationshipService/ListEdgesBatch`
- [ ] `relationship.graph.v1.RelationshipService/GetFriendIDs`
- [ ] `relationship.graph.v1.RelationshipService/GetFoFIDs`

- [ ] `relationship.post.v1.PostService/GetLastNMomentsOfUserPosts`
- [ ] `relationship.post.v1.PostService/GetLatestMomentPostsForUsers`
- [ ] `relationship.post.v1.PostService/GetPostStates`

- [ ] `relationship.socialproof.v1.SocialProofService/GetForRealette`

- [ ] `relationship.tag.v1.TagService/GetTaggedPostIds`

- [ ] `search.frontend.v1.SearchService/OASearch`
- [ ] `search.frontend.v1.SearchService/SearchUsers`

...and there's still probably missing methods in there !

</details>

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
