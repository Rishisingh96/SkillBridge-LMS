# Blog API Documentation

## Overview
The Blog API follows a hierarchical structure similar to the Course/Lecture system:
- **BlogCategory** (like Course Category) - e.g., Programming, Design, Marketing
- **BlogCourse** (like Course) - e.g., JavaScript, Python, Java
- **BlogModel** (like Module) - e.g., "Basic Java", "Advanced Python"
- **BlogTopic** (like Lecture) - Individual blog posts within a model

## Database Models

### BlogCategory
```javascript
{
  name: String (required, unique),
  slug: String (required, unique, lowercase),
  description: String,
  icon: String,
  blogCourses: [ObjectId] (ref: BlogCourse),
  creator: ObjectId (ref: User),
  isPublished: Boolean (default: false)
}
```

### BlogCourse
```javascript
{
  name: String (required),
  slug: String (required, unique, lowercase),
  description: String,
  thumbnail: String,
  blogModels: [ObjectId] (ref: BlogModel),
  blogCategory: ObjectId (ref: BlogCategory, required),
  creator: ObjectId (ref: User),
  isPublished: Boolean (default: false)
}
```

### BlogModel
```javascript
{
  title: String (required),
  slug: String (required, unique, lowercase),
  description: String,
  blogTopics: [ObjectId] (ref: BlogTopic),
  blogCourse: ObjectId (ref: BlogCourse, required),
  creator: ObjectId (ref: User),
  isPublished: Boolean (default: false)
}
```

### BlogTopic
```javascript
{
  title: String (required),
  slug: String (required, unique, lowercase),
  content: String (required),
  excerpt: String,
  thumbnail: String,
  blogModel: ObjectId (ref: BlogModel, required),
  creator: ObjectId (ref: User),
  views: Number (default: 0),
  likes: [ObjectId] (ref: User),
  comments: [CommentSchema],
  isPublished: Boolean (default: false),
  tags: [String]
}
```

## API Endpoints

### Base URL
`/api/blog`

---

## Blog Category Endpoints

### Create Blog Category
- **POST** `/api/blog/category/create`
- **Auth**: Required (Educator only)
- **Body**:
  ```json
  {
    "name": "Programming",
    "slug": "programming",
    "description": "Programming tutorials and guides",
    "icon": "code"
  }
  ```
- **Response**: Created blog category object

### Get All Published Blog Categories
- **GET** `/api/blog/categories`
- **Auth**: Not required
- **Response**: Array of published blog categories

### Get Blog Category By ID
- **GET** `/api/blog/category/:categoryId`
- **Auth**: Not required
- **Response**: Blog category with nested courses, models, and topics

### Toggle Publish Blog Category
- **PUT** `/api/blog/category/publish/:categoryId`
- **Auth**: Required (Educator only)
- **Response**: Updated blog category with new publish status

### Delete Blog Category
- **DELETE** `/api/blog/category/:categoryId`
- **Auth**: Required (Educator only)
- **Response**: Success message

---

## Blog Course Endpoints

### Create Blog Course
- **POST** `/api/blog/course/create/:blogCategoryId`
- **Auth**: Required (Educator only)
- **Params**: `blogCategoryId` - ID of the parent category
- **Body**:
  ```json
  {
    "name": "JavaScript",
    "slug": "javascript",
    "description": "JavaScript tutorials"
  }
  ```
- **Response**: Created blog course object

### Get Blog Courses by Category
- **GET** `/api/blog/courses/:blogCategoryId`
- **Auth**: Not required
- **Params**: `blogCategoryId` - ID of the category
- **Response**: Array of blog courses with nested models and topics

### Get Blog Course By ID
- **GET** `/api/blog/course/:blogCourseId`
- **Auth**: Not required
- **Response**: Blog course with nested models and topics

### Toggle Publish Blog Course
- **PUT** `/api/blog/course/publish/:blogCourseId`
- **Auth**: Required (Educator only)
- **Response**: Updated blog course with new publish status

### Delete Blog Course
- **DELETE** `/api/blog/course/:blogCourseId`
- **Auth**: Required (Educator only)
- **Response**: Success message

---

## Blog Model Endpoints

### Create Blog Model
- **POST** `/api/blog/model/create/:blogCourseId`
- **Auth**: Required (Educator only)
- **Params**: `blogCourseId` - ID of the parent course
- **Body**:
  ```json
  {
    "title": "Basic Java",
    "slug": "basic-java",
    "description": "Fundamental Java concepts"
  }
  ```
- **Response**: Created blog model object

### Get Blog Models by Course
- **GET** `/api/blog/models/:blogCourseId`
- **Auth**: Not required
- **Params**: `blogCourseId` - ID of the course
- **Response**: Array of blog models with nested topics

### Get Blog Model By ID
- **GET** `/api/blog/model/:blogModelId`
- **Auth**: Not required
- **Response**: Blog model with nested topics

### Toggle Publish Blog Model
- **PUT** `/api/blog/model/publish/:blogModelId`
- **Auth**: Required (Educator only)
- **Response**: Updated blog model with new publish status

### Delete Blog Model
- **DELETE** `/api/blog/model/:blogModelId`
- **Auth**: Required (Educator only)
- **Response**: Success message

---

## Blog Topic Endpoints

### Create Blog Topic
- **POST** `/api/blog/topic/create/:blogModelId`
- **Auth**: Required (Educator only)
- **Params**: `blogModelId` - ID of the parent model
- **Body**:
  ```json
  {
    "title": "Introduction to Variables",
    "slug": "introduction-to-variables",
    "content": "Full blog content here...",
    "excerpt": "Short summary...",
    "tags": ["variables", "basics", "java"]
  }
  ```
- **Response**: Created blog topic object

### Get Blog Topics by Model
- **GET** `/api/blog/topics/:blogModelId`
- **Auth**: Not required
- **Params**: `blogModelId` - ID of the model
- **Response**: Array of blog topics

### Get Blog Topic By ID
- **GET** `/api/blog/topic/:blogTopicId`
- **Auth**: Not required
- **Response**: Blog topic with full details (increments view count)

### Edit Blog Topic
- **PUT** `/api/blog/topic/edit/:blogTopicId`
- **Auth**: Required (Educator only)
- **Content-Type**: `multipart/form-data`
- **Body**: Can include `thumbnail` file and any of:
  ```json
  {
    "title": "Updated Title",
    "slug": "updated-slug",
    "content": "Updated content...",
    "excerpt": "Updated excerpt...",
    "tags": ["updated", "tags"],
    "isPublished": true
  }
  ```
- **Response**: Updated blog topic

### Toggle Publish Blog Topic
- **PUT** `/api/blog/topic/publish/:blogTopicId`
- **Auth**: Required (Educator only)
- **Response**: Updated blog topic with new publish status

### Delete Blog Topic
- **DELETE** `/api/blog/topic/:blogTopicId`
- **Auth**: Required (Educator only)
- **Response**: Success message

### Like Blog Topic
- **PUT** `/api/blog/topic/like/:blogTopicId`
- **Auth**: Required
- **Response**: Like status and like count

---

## Comment Endpoints

### Add Comment to Blog Topic
- **POST** `/api/blog/topic/comment/:blogTopicId`
- **Auth**: Required
- **Body**:
  ```json
  {
    "message": "Great article!"
  }
  ```
- **Response**: Created comment

### Add Reply to Comment
- **POST** `/api/blog/topic/comment/reply/:blogTopicId/:commentId`
- **Auth**: Required
- **Body**:
  ```json
  {
    "message": "Thanks for the feedback!"
  }
  ```
- **Response**: Created reply

### Like Comment
- **PUT** `/api/blog/topic/comment/like/:blogTopicId/:commentId`
- **Auth**: Required
- **Response**: Like status and like count

### Like Reply
- **PUT** `/api/blog/topic/comment/reply/like/:blogTopicId/:commentId/:replyId`
- **Auth**: Required
- **Response**: Like status and like count

### Delete Comment
- **DELETE** `/api/blog/topic/comment/:blogTopicId/:commentId`
- **Auth**: Required
- **Response**: Success message

### Delete Reply
- **DELETE** `/api/blog/topic/comment/reply/:blogTopicId/:commentId/:replyId`
- **Auth**: Required
- **Response**: Success message

---

## Usage Flow Example

### Step 1: Create a Blog Category
```http
POST /api/blog/category/create
{
  "name": "Programming",
  "slug": "programming",
  "description": "Programming tutorials",
  "icon": "code"
}
```

### Step 2: Create a Blog Course under the Category
```http
POST /api/blog/course/create/{categoryId}
{
  "name": "JavaScript",
  "slug": "javascript",
  "description": "JavaScript tutorials"
}
```

### Step 3: Create a Blog Model under the Course
```http
POST /api/blog/model/create/{courseId}
{
  "title": "Basic JavaScript",
  "slug": "basic-javascript",
  "description": "Fundamental JavaScript concepts"
}
```

### Step 4: Create Blog Topics under the Model
```http
POST /api/blog/topic/create/{modelId}
{
  "title": "Introduction to Variables",
  "slug": "introduction-to-variables",
  "content": "Full blog content...",
  "excerpt": "Short summary...",
  "tags": ["variables", "basics"]
}
```

### Step 5: Publish the Content
```http
PUT /api/blog/category/publish/{categoryId}
PUT /api/blog/course/publish/{courseId}
PUT /api/blog/model/publish/{modelId}
PUT /api/blog/topic/publish/{topicId}
```

---

## Notes

- All endpoints use JWT authentication (except public GET endpoints)
- Educators can create, edit, and delete blog content
- Public users can read published blog content
- Views are automatically incremented when a topic is fetched
- Comments and likes are available for authenticated users
- Thumbnail uploads use Cloudinary
- All slugs must be unique within their respective collections
