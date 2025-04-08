// Chức năng gửi yêu cầu
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if (listBtnAddFriend.length > 0) {
  listBtnAddFriend.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.add("add");

      const userId = button.getAttribute("btn-add-friend");
      socket.emit("CLIENT_ADD_FRIEND", userId);
    });
  });
}
// End Chức năng gửi yêu cầu

// Chức năng hủy yêu cầu kết bạn
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if (listBtnCancelFriend.length > 0) {
  listBtnCancelFriend.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.remove("add");

      const userId = button.getAttribute("btn-cancel-friend");
      socket.emit("CLIENT_CANCEL_FRIEND", userId);
    });
  });
}
// End Chức năng hủy yêu cầu kết bạn

// Function từ chối lời mời kết bạn
const refuseFriend = (button) => {
  button.addEventListener("click", () => {
    button.closest(".box-user").classList.add("refuse");

    const userId = button.getAttribute("btn-refuse-friend");
    socket.emit("CLIENT_REFUSE_FRIEND", userId);
  });
};
// End Function từ chối lời mời kết bạn

// Chức năng từ chối lời mời kết bạn
const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if (listBtnRefuseFriend.length > 0) {
  listBtnRefuseFriend.forEach((button) => {
    refuseFriend(button);
  });
}
// End Chức năng từ chối lời mời kết bạn

// Function chấp nhận lời mời kết bạn
const acceptFriend = (button) => {
  button.addEventListener("click", () => {
    button.closest(".box-user").classList.add("accepted");

    const userId = button.getAttribute("btn-accept-friend");
    socket.emit("CLIENT_ACCEPT_FRIEND", userId);
  });
};
// End Function chấp nhận lời mời kết bạn

// Chức năng chấp nhận lời mời kết bạn
const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if (listBtnAcceptFriend.length > 0) {
  listBtnAcceptFriend.forEach((button) => {
    acceptFriend(button);
  });
}
// End Chức năng chấp nhận lời mời kết bạn

// SERVER_RETURN_LENGTH_ACCEPT_FRIEND
socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", (data) => {
  const badgeUserAccept = document.querySelector("[badge-users-accept]");
  const userId = badgeUserAccept.getAttribute("badge-users-accept");

  if (userId == data.userId) {
    badgeUserAccept.innerHTML = data.lengthAcceptFriends;
  }
});
// End SERVER_RETURN_LENGTH_ACCEPT_FRIEND

// SERVER_RETURN_INFO_ACCEPT_FRIEND
socket.on("SERVER_RETURN_INFO_ACCEPT_FRIEND", (data) => {
  // Trang lời mời kết bạn
  const dataUsersAccept = document.querySelector("[data-users-accept]");
  if (dataUsersAccept) {
    const userId = dataUsersAccept.getAttribute("data-users-accept");

    if (userId == data.userId) {
      // Vẽ user ra giao diện
      const newBoxUser = document.createElement("div");
      newBoxUser.classList.add("col-4");
      newBoxUser.setAttribute("user-id", data.userInfoA._id);

      newBoxUser.innerHTML = `
      <div class="box-user mb-3">
        <div class="inner-avatar">
          <img src=${
            data.userInfoA.avatar
              ? data.userInfoA.avatar
              : "/images/user-avatar-male.png"
          } alt=${data.userInfoA.fullName}>
        </div>
        <div class="inner-info">
          <div class="inner-name">${data.userInfoA.fullName}</div>
          <div class="inner-button">
            <button class="btn btn-sm btn-primary mr-1" btn-accept-friend=${
              data.userInfoA._id
            }>Chấp nhận</button>
            <button class="btn btn-sm btn-primary mr-1" btn-refuse-friend=${
              data.userInfoA._id
            }>Từ chối</button>
            <button class="btn btn-sm btn-primary mr-1" btn-deleted-friend="btn-deleted-friend" disable="disable">Đã xóa</button>
            <button class="btn btn-sm btn-primary mr-1" btn-accepted-friend="btn-accepted-friend" disable="disable">Các bạn đã là bạn bè của nhau</button>
          </div>
        </div>
      </div>
    `;
      dataUsersAccept.appendChild(newBoxUser);
      // End Vẽ user ra giao diện

      // Xóa lời mời kết bạn
      const btnRefuseFriend = newBoxUser.querySelector("[btn-refuse-friend]");
      refuseFriend(btnRefuseFriend);
      // End Xóa lời mời kết bạn

      // Chức năng chấp nhận lời mời kết bạn
      const btnAcceptFriend = newBoxUser.querySelector("[btn-accept-friend]");
      acceptFriend(btnAcceptFriend);
      // End Chức năng chấp nhận lời mời kết bạn
    }
  }
  // End Trang lời mời kết bạn

  // Trang danh sách người dùng
  const dataUsersNotFriend = document.querySelector("[data-users-not-friend]");
  if (dataUsersNotFriend) {
    const userId = dataUsersNotFriend.getAttribute("data-users-not-friend");
    if (userId == data.userId) {
      // Xóa A khỏi danh sách của B
      const boxUserRemove = dataUsersNotFriend.querySelector(
        `[user-id="${data.userInfoA._id}"]`
      );
      if (boxUserRemove) {
        dataUsersNotFriend.removeChild(boxUserRemove);
      }
    }
  }
  // End Trang danh sách người dùng
});
// End SERVER_RETURN_INFO_ACCEPT_FRIEND

// SERVER_RETURN_USER_ID_CANCEL_FRIEND
socket.on("SERVER_RETURN_USER_ID_CANCEL_FRIEND", (data) => {
  const dataUsersAccept = document.querySelector("[data-users-accept]");
  const userId = dataUsersAccept.getAttribute("data-users-accept");

  if (userId == data.userId) {
    // Xóa A khỏi danh sách của B
    const boxUserRemove = dataUsersAccept.querySelector(
      `[user-id="${data.userIdA}"]`
    );
    if (boxUserRemove) {
      dataUsersAccept.removeChild(boxUserRemove);
    }
  }
});
// End SERVER_RETURN_USER_ID_CANCEL_FRIEND

// Funciton status online/offline
const statusOnlineOffline = (status, userId) => {
  const dataUsersFriend = document.querySelector("[data-users-friend]");
  if (dataUsersFriend) {
    const boxUser = dataUsersFriend.querySelector(`[user-id="${userId}"]`);
    if (boxUser) {
      boxUser.querySelector("[status]").setAttribute("status", status);
    }
  }
};
// End Funciton status online/offline

// SERVER_RETURN_USER_ONLINE
socket.on("SERVER_RETURN_USER_ONLINE", (userId) => {
  statusOnlineOffline("online", userId);
});
// End SERVER_RETURN_USER_ONLINE

// SERVER_RETURN_USER_OFFLINE
socket.on("SERVER_RETURN_USER_OFFLINE", (userId) => {
  statusOnlineOffline("offline", userId);
});
// End SERVER_RETURN_USER_OFFLINE
