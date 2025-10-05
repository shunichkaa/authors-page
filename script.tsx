const forumLatest = "https://cdn.freecodecamp.org/curriculum/forum-latest/latest.json";
const forumTopicUrl = "https://forum.freecodecamp.org/t/";
const forumCategoryUrl = "https://forum.freecodecamp.org/c/";
const avatarUrl = "https://sea1.discourse-cdn.com/freecodecamp";

const postsContainer = document.getElementById("posts-container") as HTMLElement | null;

type CategoryInfo = { category: string; className: string };
type CategoryMap = Record<number, CategoryInfo>;

type SelectedCategory = { className: string; category: string; id?: number };

type Poster = { user_id: number };
type User = { id: number; name: string; avatar_template: string };

type Topic = {
  id: number;
  title: string;
  views: number;
  posts_count: number;
  slug: string;
  posters: Poster[];
  category_id: number;
  bumped_at: string | number;
};

type TopicList = { topics: Topic[] };

type LatestData = { topic_list: TopicList; users: User[] };

const allCategories: CategoryMap = {
  299: { category: "Career Advice", className: "career" },
  409: { category: "Project Feedback", className: "feedback" },
  417: { category: "freeCodeCamp Support", className: "support" },
  421: { category: "JavaScript", className: "javascript" },
  423: { category: "HTML - CSS", className: "html-css" },
  424: { category: "Python", className: "python" },
  432: { category: "You Can Do This!", className: "motivation" },
  560: { category: "Backend Development", className: "backend" },
};

const forumCategory = (id: number): string => {
  let selectedCategory: SelectedCategory = { className: "general", category: "General" };

  if (Object.prototype.hasOwnProperty.call(allCategories, id)) {
    const { className, category } = allCategories[id];
    selectedCategory.className = className;
    selectedCategory.category = category;
  } else {
    selectedCategory.id = 1;
  }
  const url = `${forumCategoryUrl}${selectedCategory.className}/${id}`;
  const linkText = selectedCategory.category;
  const linkClass = `category ${selectedCategory.className}`;

  return `<a href="${url}" class="${linkClass}" target="_blank">\n    ${linkText}\n  </a>`;
};

const timeAgo = (time: string | number | Date): string => {
  const currentTime = new Date();
  const lastPost = time instanceof Date ? time : new Date(time as string | number);

  const timeDifference = currentTime.getTime() - lastPost.getTime();
  const msPerMinute = 1000 * 60;

  const minutesAgo = Math.floor(timeDifference / msPerMinute);
  const hoursAgo = Math.floor(minutesAgo / 60);
  const daysAgo = Math.floor(hoursAgo / 24);

  if (minutesAgo < 60) {
    return `${minutesAgo}m ago`;
  }

  if (hoursAgo < 24) {
    return `${hoursAgo}h ago`;
  }

  return `${daysAgo}d ago`;
};

const viewCount = (views: number): string => {
  const thousands = Math.floor(views / 1000);

  if (views >= 1000) {
    return `${thousands}k`;
  }

  return String(views);
};

const avatars = (posters: Poster[], users: User[]): string => {
  return posters
    .map((poster: Poster) => {
      let user: User | undefined = undefined;
      for (let i = 0; i < users.length; i++) {
        if (users[i].id === poster.user_id) {
          user = users[i];
          break;
        }
      }
      if (user) {
        const avatar = user.avatar_template.replace(/{size}/, "30");
        const userAvatarUrl = avatar.indexOf("/user_avatar/") === 0
          ? avatarUrl.concat(avatar)
          : avatar;
        return `<img src="${userAvatarUrl}" alt="${user.name}" />`;
      }
      return "";
    })
    .join("");
};

function fetchData(): void {
  fetch(forumLatest)
    .then((res) => res.json())
    .then((data: LatestData) => {
      showLatestPosts(data);
    })
    .catch((err) => {
      console.log(err);
    });
}

fetchData();

const showLatestPosts = (data: LatestData): void => {
  const { topic_list, users } = data;
  const { topics } = topic_list;

  if (!postsContainer) return;

  postsContainer.innerHTML = topics
    .map((item: Topic) => {
      const { id, title, views, posts_count, slug, posters, category_id, bumped_at } = item;

      return `
    <tr>
      <td>
<a 
  class="post-title" 
  href="${forumTopicUrl}${slug}/${id}" 
  target="_blank"
>
  ${title}
</a>

        ${forumCategory(category_id)}
      </td>
      <td>
        <div class="avatar-container">
          ${avatars(posters, users)}
        </div>
      </td>
      <td>${posts_count - 1}</td>
      <td>${viewCount(views)}</td>
      <td>${timeAgo(bumped_at)}</td>
    </tr>`;
    })
    .join("");
};