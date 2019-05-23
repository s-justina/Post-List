import {Component} from './modules/component'
import {type} from "os";

window.onload = () => {

    type postsData = {
        posts: object[]
    };

    let postList: Component;
    let sortButtons: Component;
    let postsData: postsData;

    function loadDoc() {
        const xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                postsData = showData(this.responseText);
                startApp(postsData);

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

    //2) napisać funkcję, która umożliwi sortowanie po "upvotes", "downvotes",
    // "score" lub dacie "created" w zależności od przekazanego parametru
    const sortByParam = (param) => (prevPost, post) => {
        return post[`${param}`] - prevPost[`${param}`]
    };
    //3) napisać funkcję, która zwróci tytuł postu z najwyższym stosunkiem głosów dodatnich
    // i ujemnych (w przypadku kilku postów o jednakowych współczynnikach, wybrać najnowszy z nich)

    const returnBestPost = (posts) => {
        return posts.reduce((prevPost, currPost) => {

            if (prevPost.score !== currPost.score) {
                return (prevPost.score > currPost.score) ? prevPost : currPost
            } else if (prevPost.score === currPost.score) {
                return (prevPost.created > currPost.created) ? prevPost : currPost
            }
        });
    };

    //4) napisać funkcję, która wyświetli posty tylko z ostatniego dnia (24h wstecz)

    const returnPostsFromLast24h = (data) => data.posts.filter(post => {
        const time24HAgo = Date.now() - (24 * 60 * 60 * 1000);
        return post.created > Math.round(time24HAgo / 1000)
    });

    const renderPosts = (posts): string => {
        const postsToRender = posts.map(post => {
           return (
               '<li>' +
                    `<p>Title: ${post.title}</p>` +
                    '<div>' +
                        `<p class="score">Upvotes: ${post.upvotes}</p>` +
                        `<p class="score">Downvotes: ${post.downvotes}</p>` +
                    '</div>' +
               '</li>'
           )
        }).reduce((prev,curr) => prev + curr);

        return (
            '<ul>' + (postsToRender) + '</ul>'
        )
    };


    const startApp = (data) => {


        const sortedArray = data.posts.sort(sortByParam('num_comments'));

        const bestPost = returnBestPost(data.posts);

        const latestPosts = returnPostsFromLast24h(data);

        postList = new Component('#postList', {
            props: data.posts,
            template: () => {
                return (
                    '<div class="post-list">' +
                          (renderPosts(postList.props))+
                    '</div>'
                )
            }
        });

        sortButtons = new Component('#sort-dropdown', {
            props: data,
            template: () => {
                    return (
                        '<button sort-btn="showBestPost">' + 'Show best post' + '</button>'+
                        '<button sort-btn="showAllPosts">' + 'Show all posts' + '</button>'+
                        '<button sort-btn="something">' + 'BTN NOT RDY' + '</button>'
                    )
                }
            });


        console.log(sortButtons);

        sortButtons.render();
        postList.render();
    };

    const clickHandler = function (event): void {
        // Check if a reflex action button was clicked
        const action = event.target.getAttribute('sort-btn');

        if (!action) return;


        if(action === 'showBestPost'){
            console.log('klikk')
            const bestPost = returnBestPost(postList.props)
            postList.setProps([bestPost]);

            postList.render();
        } else if(action === 'showAllPosts'){
            console.log(postsData.posts)
            postList.setProps(postsData.posts)
            postList.render();
        } else if (action === 'sortPosts'){
            // const sortedPosts = postList.props.sort(sortByParam())
        }
    };


    loadDoc();
    document.addEventListener('click', clickHandler, false)
};







