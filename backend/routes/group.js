const express = require("express");
const router = express.Router();
const groupdb = require("../groupDB");
const isEmpty = require("is-empty");
const Chatkit = require("@pusher/chatkit-server");

const chatkit = new Chatkit.default({
  instanceLocator: "v1:us1:8d540c79-80d9-4850-a367-72bce6dc16c5",
  key:
    "9cc4a113-e6f1-4109-92f9-799391e959c5:NBzZCZrvWUf1bdIblQR56oGOiELvMsfJq2nyFvR6Jg0=" // This is bad, use .env vars
});




// @route GET /:course/group?user=fluxtheory
// @desc Show list of groups in course, option for user-joined groups
// @query user  if not empty, then returns only that user's joined groups
// @access private
router.get('/:course/group', (req, res) => {
    
    let user = req.query.user;
    let course = req.params.course;
    //console.log(user,course);
    if(user){
        groupdb.getUserJoinedGroups(user, course).then(rows => {
            return res.status(200).json(rows);
        }).catch( err => {
            return res.status(500).json(err);
        });
    } else {
        groupdb.getListofGroups(course).then( rows => {
            return res.status(200).json(rows);
        }).catch( err => {
            return res.status(500).json(err);
        });        
    }
});

const makeGroupId = (groupName, course) => {
  return `__group__|${course}|${groupName}`;
};
// @route POST /:course/group
// @desc Create group
// @body username, group_name
// @access private
router.post("/:course/group", (req, res) => {
  const { username, group_name } = req.body;
  const chatkitGroupId = makeGroupId(group_name, req.params.course);
  groupdb
    .startGroup(username, group_name, req.params.course)
    .then(success => {
      if (success) {
        chatkit
          .createRoom({
            id: chatkitGroupId,
            creatorId: username,
            name: group_name
          })
          .then(() => {
            console.log("Room created successfully");
            return chatkit.addUsersToRoom({
              roomId: chatkitGroupId,
              userIds: [username]
            });
          })
          .then(somethingProbablyNotImportant => {
            return res.status(200).json({ success: true });
          })
          .catch(err => {
            if (
              err.error === "services/chatkit/bad_request/duplicate_room_id"
            ) {
              return res.status(200).json({ success: true });
            }
            console.log(err);
            // TODO: better error message
            return res.status(500).json(err);
          });
      } else {
        return res.status(400).json({ success: false });
      }
    })
    .catch(err => {
      return res.status(500).json(err);
    });
});



// @route POST /:course/delete-group
// @desc Deletes a group
// @body group_name
// @access Private
router.post("/:course/delete-group", (req, res) => {
  groupdb
    .deleteGroup(req.body.group_name, req.params.course)
    .then(success => {
      if (success) {
        return res.status(200).json({ success: true });
      } else {
        return res.status(400).json({ success: false });
      }
    })
    .catch(err => {
      return res.status(500).json(err);
    });
});

//@route POST /:course/group/add
//@desc Add a user to a group
//@body group_name, username
//@access Private
router.post("/:course/group/add", (req, res) => {
  const chatkitGroupId = makeGroupId(req.body.group_name, req.params.course);
  groupdb
    .addUsertoGroup(req.body.username, req.body.group_name, req.params.course)
    .then(success => {
      if (success) {
        return chatkit.addUsersToRoom({
          roomId: chatkitGroupId,
          userIds: [req.body.username]
        });
      } else {
        return res.status(400).json({ success: false });
      }
    })
    .then(()=> {
      return res.status(200).json({ success: true });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json(err);
    });
});


//@route POST /:course/group/remove
//@desc Remove or Leave from a group
//@body group_name, username
//@access Private
router.post("/:course/group/remove", (req, res) => {
  groupdb
    .removeUserfromGroup(
      req.body.username,
      req.body.group_name,
      req.params.course
    )
    // MRTODO: chatkit scaffold test after master merge
    .then(success => {
      if (success) {
        return chatkit.removeUsersFromRoom({
          roomId: makeGroupId(req.body.group_name, req.params.course),
          userIds: [ req.body.username ],
        });
      } else {
        return res.status(404).json({ success: success });
      }
    })
    //.then(MRTODO => {
    //  return res.status(200).json({ success: success });
    //})
    .catch(err => {
      console.log(err.message);
      return res.status(500).json(err);
    });
});

//@route POST /:course/group/transfer-ownership
//@desc Transfers group ownership to another user
//@body { group_name, username }
//@access Private

router.post("/:course/group/transfer-ownership", (req, res) => {
    groupdb.transferGroupOwnership(req.body.username, req.body.group_name, req.params.course)
    .then(success => {
        if(success){
            return res.status(200).json({"success": success});
        } else {
            return res.status(404).json({"success": success});
        }
    })
    .catch(err => {
        return res.status(500).json(err);
    })
})

// @route GET /:course/group-users
// @desc Get group users
// @params group
// @access Private
router.get("/:course/group-users", (req, res) => {
    
    const { course } = req.params;
    const group = req.query.group;
    
    groupdb.getGroupUsers(group, course)
    .then(rows => {
        return res.status(200).json(rows);
    })
    .catch(err => {
        return res.status(500).json(err);
    });
});


module.exports = router;