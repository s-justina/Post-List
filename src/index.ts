

  function loadDoc() {
    const xhttp = new XMLHttpRequest();

     xhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
          const data = showData(this.responseText);
          startApp(data)
      }
    };

    xhttp.open("GET", "https://www.reddit.com/r/funny.json", true);
    xhttp.send();
  }

  const showData = (response) => {
    const posts = JSON.parse(response).data.children.map(el => {
      return {
        "title": el.data.title,
        "upvotes": el.data.ups,
        "downvotes": el.data.downs,
        "score": el.data.score,
        "num_comments": el.data.num_comments,
        "created": el.data.created,
      }
    });

    const count = JSON.parse(response).data.dist;

    return {
      "posts": posts,
      count
    }
  };

  const startApp = (data) => {
    const sortedArray = data.posts.sort(sortByParam('num_comments'));

    const bestPost = returnBestPost(data);

    const latestPosts = returnPostsFromLast24h(data)
    console.log(latestPosts);
  };

  //2) napisać funkcję, która umożliwi sortowanie po "upvotes", "downvotes",
  // "score" lub dacie "created" w zależności od przekazanego parametru
  const sortByParam = (param) => (prevPost, post) => {
      return post[`${param}`] - prevPost[`${param}`]
  };
  //3) napisać funkcję, która zwróci tytuł postu z najwyższym stosunkiem głosów dodatnich
  // i ujemnych (w przypadku kilku postów o jednakowych współczynnikach, wybrać najnowszy z nich)

  const returnBestPost = (data) => {
    return data.posts.reduce((prevPost,currPost) => {

      if(prevPost.score !== currPost.score){
        return (prevPost.score > currPost.score) ? prevPost : currPost
      } else if(prevPost.score === currPost.score){
        return (prevPost.created > currPost.created) ? prevPost : currPost
      }
    });
  };

  //4) napisać funkcję, która wyświetli posty tylko z ostatniego dnia (24h wstecz)

  const returnPostsFromLast24h = (data) => data.posts.filter(post => {
    const time24HAgo = Date.now() - (24 * 60 * 60 * 1000);
    return post.created > Math.round(time24HAgo/1000)
  });


  loadDoc();






