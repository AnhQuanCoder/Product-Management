module.exports = (query) => {
    let objectSearch = {
        keyword: ""
    };

    if (query.keyword) {
        objectSearch.keyword = query.keyword;
        // Dùng regex để có thể hoàn thành nốt chuỗi
        const regex = new RegExp(objectSearch.keyword, "i");
        objectSearch.regex = regex;
    }

    return objectSearch;
}