
const apiBaseURL = "https://tp-final-ariannev-rickya.glitch.me/api/images";
const apiBaseURL2 = "https://tp-final-ariannev-rickya.glitch.me/";
//lien qui sont avec glitch. edge ne fontionne pas surper
function HEAD(successCallBack, errorCallBack) {
    $.ajax({
        url: apiBaseURL,
        type: 'HEAD',
        contentType: 'text/plain',
        complete: request => { successCallBack(request.getResponseHeader('ETag')) },
        error: function (jqXHR) { errorCallBack(jqXHR.status) }
    });
}
function GET_ID(id, successCallBack, errorCallBack) {
    $.ajax({
        url: apiBaseURL + "/" + id,
        type: 'GET',
        headers: getBearerAuthorizationToken(),
        success: data => { successCallBack(data); },
        error: function (jqXHR) { errorCallBack(jqXHR.status) }
    });
}
function GET_ALL(successCallBack, errorCallBack, queryString = null) {
    let url = apiBaseURL + (queryString ? queryString : "");
    $.ajax({
        url: url,
        type: 'GET',
        success: (data, status, xhr) => { successCallBack(data, xhr.getResponseHeader("ETag")) },
        error: function (jqXHR) { errorCallBack(jqXHR.status) }
    });
}
function POST(data, successCallBack, errorCallBack) {
    $.ajax({
        url: apiBaseURL,
        type: 'POST',
        headers: getBearerAuthorizationToken(),
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: (userCreated) => { successCallBack(userCreated) },
        error: function (jqXHR) { errorCallBack(jqXHR.status) }
    });
}
function PUT(image, successCallBack, errorCallBack) {
    $.ajax({
        url: apiBaseURL + "/" + image.Id,
        type: 'PUT',
        headers: getBearerAuthorizationToken(),
        contentType: 'application/json',
        data: JSON.stringify(image),
        success: () => { successCallBack() },
        error: function (jqXHR) { errorCallBack(jqXHR.status) }
    });
}
function DELETE(id, successCallBack, errorCallBack) {
    $.ajax({
        url: apiBaseURL + "/" + id,
        type: 'DELETE',
        headers: getBearerAuthorizationToken(),
        success: () => { successCallBack() },
        error: function (jqXHR) { errorCallBack(jqXHR.status) }
    });
}

/*-------------------IMAGE----------------------------*/
/*function PostImage(data, successCallBack, errorCallBack){
    $.ajax({
        url: apiBaseURL,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: (data) => { successCallBack(data) },
        error: function (jqXHR) { errorCallBack(jqXHR.status) }
    });
}*/
/*function PutImage(bookmark, successCallBack, errorCallBack) {
    $.ajax({
        url: apiBaseURL + "/" + bookmark.Id,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(bookmark),
        success: () => { successCallBack() },
        error: function (jqXHR) { errorCallBack(jqXHR.status) }
    });
}*/

/*--------------------USER-------------------------------*/
function PostUser(data, successCallBack, errorCallBack){
    $.ajax({
        url: apiBaseURL2 + "accounts/register",
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: (newData) => {successCallBack(newData.Id) },
        error: function (jqXHR) { errorCallBack(jqXHR.status) }
    });
}
function DeleteUser(user, successCallBack, errorCallBack) {
    $.ajax({
        url: apiBaseURL2 + "accounts/remove/" + user,
        type: 'GET',
        headers: getBearerAuthorizationToken(),
        success: () => { successCallBack() },
        error: function (jqXHR) { errorCallBack(jqXHR.status) }
    });
}
function PutUser(userInfo, successCallBack, errorCallBack){
    $.ajax({
        url: apiBaseURL2 + "accounts/modify/" + userInfo.Id,
        type: 'PUT',
        headers: getBearerAuthorizationToken(),
        contentType: 'application/json',
        data: JSON.stringify(userInfo),
        success: () => {successCallBack()},
        error: function (jqXHR) { errorCallBack(jqXHR.status) }
    });
}
function VerifyUser(verifyUser, successCallBack, errorCallBack){
    $.ajax({
        url: apiBaseURL2 + "accounts/verify?id=" + verifyUser.Id + "&code=" + verifyUser.VerifyCode,
        type: 'GET',
        contentType: 'application/json',
        success: (verifyUser) => { storeToken(verifyUser); successCallBack(verifyUser); },
        error: function (jqXHR) { errorCallBack(jqXHR.status) }
    });
}
function getUserInfo(userId, successCallBack, errorCallBack){
    $.ajax({
        url: apiBaseURL2 + "accounts/index/" + userId,
        type: 'GET',
        success: (userInfo) => { localStorage.setItem('user', JSON.stringify(userInfo)); successCallBack() },
        error: function (jqXHR) { errorCallBack(jqXHR.status) }
    });
}
/*----------------------TOKEN---------------------------------*/
function deleteToken(){
    localStorage.removeItem('token');
}
function storeToken(tokeninfo){
    localStorage.setItem('token', tokeninfo.Access_token);
}
function retrieveToken(){
    return localStorage.getItem('token');
}
function getBearerAuthorizationToken() {
    return { 'Authorization': 'Bearer ' + retrieveToken() };
}
function login(credentials, successCallBack, errorCallBack) {
    $.ajax({
        url: apiBaseURL2 + "token", // "token" va devenir l'information du token crée
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(credentials),
        success: (tokenInfo) => {
            storeToken(tokenInfo);
            getUserInfo(tokenInfo.UserId, successCallBack, errorCallBack);
        },
        error: function (jqXHR) { errorCallBack(jqXHR.status) }
    });
}
function logout(credentials, successCallBack, errorCallBack){
    $.ajax({
        url: apiBaseURL2 + "token",
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(credentials),
        success: () => { deleteToken(); successCallBack();},
        error: function (jqXHR) { errorCallBack(jqXHR.status) }
    });
}