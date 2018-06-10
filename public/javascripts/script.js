$(document).ready(() => {
    $(".single-thread").click(function () {
        $(".posts").empty();
        const tId = $(this).data('id');

        $.getJSON(`/thread/${tId}/posts`, res => {
            res.forEach(post => {
                let content;
                if (post.type === "picture")
                    content = `<img class="img-fluid center-block" src=${post.picturePath}>`;
                else if (post.type === "text")
                    content = `<p class="text">${post.description}</p>`;
                else
                    content = `<p><a href="${post.link}" class="link">${post.link}</a></p>`;

                $('.posts').append(
                    `
                    <div class="single-post">
                        <div class="row top">
                            <div class="col-md-3">
                                <img class="header-image" src="${post.creator.picturePath}">
                            </div>
                            <div class="col-md-9">
                                <h3>${post.title}</h3>
                                <h6>${post.creator.username}</h6>
                            </div>
                        </div>
                        <div class="row content">
                            ${content}
                        </div>
                        <div class="row align-items-center bottom bottom-${post._id}">
                            <div class="upvote col-md-4 offset-md-2">
                                <div>
                                    <button class="upvote" id=${post._id}><img src="/images/peace-emoji-navy.png"></button>
                                    <span><strong class="vote-count-${post._id}">${post.votes}</strong></span>
                                </div>
                            </div>
                            <div class="col-md-1" style="border-left: 2px solid #1ba8e2; height: 50px;"></div>
                            <div class="col-md-4 offset-md-1 comment-board-${post._id}">
                                <button class="comment-button" data-comment="${post._id}">
                                    <img src="/images/chat box.png">
                                </button>
                            </div>
                        </div>

                        <div class="row comment-board">
                        </div>
                    </div>
                    `
                )
            })
            $(".upvote").click(function () {
                let postId = this.id;
                $.getJSON(`/post/upvote/${postId}`, vote => {
                    $(`.vote-count-${postId}`).html(`${vote}`);
                })

            });

            $(".comment-button").click(function () {
                let postId = $(this).data('comment');
                $.getJSON(`/post/${postId}/comment`, comments => {
                    comments.forEach(function (comment) {
                        $(`.bottom-${postId}`).append(
                            `
                                <div class="single-comment">
                                    <img src="${comment.creator.picturePath}">
                                    <h5>${comment.creator.username}</h5>
                                    <span>${comment.content}</span>
                                </div>
                            `
                        )
                    })
                    $(`.bottom-${postId}`).append(
                        `
                        <form action="/new-comment/${postId}" method="POST">
                            <textarea type="text" name="comment" cols="50"></textarea>
                            <input type="submit" value="Comment">
                        </form>
                        `
                    )
                })
            })

            // .promise().done(function () {

            //     $(".upvote").click(function () {
            //         postId = this.id;
            //         console.log(postId);
            //         $.getJSON(`/post/upvote/${postId}`, vote => {
            //             $(`.vote-count-${postId}`).text(vote);
            //         })

            //     })


            //     $(`.comment-button`).click(function () {
            //         $('.comment-board').empty();
            //         const postId = this.id.slice(8);
            //         console.log("post-id: ", postId)
            // $.getJSON(`/post/${postId}/comment`, comments => {
            //     comments.forEach( function (comment) {
            //         $('.comment-board').append(
            //             `
            //                 <div class="single-comment">
            //                     <img src="${comment.creator.picturePath}">
            //                     <h5>${comment.creator.username}</h5>
            //                     <span>${comment.content}</span>
            //                 </div>
            //             `
            //         )
            //     })
            //     $(`.comment-board`).append(
            //         `
            //         <form action="/new-comment/${postId}" method="POST">
            //             <textarea type="text" name="comment" cols="50"></textarea>
            //             <input type="submit" value="Comment">
            //         </form>
            //         `
            //     )
            //         })

            //     })
            // })


        })
    })

    $(".delte-post").click(function () {
        console.log("this: ", this)
        const postId = $(this).data('del');
        console.log("postID: ", postId);
        $.getJSON(`/delete-post/${postId}`, () => {
            console.log("Deleted");
        })
    })

});
