const db = require("../database/db")

//Create a new user

const postUser = (req,res)=>{
    const username = req.body.username;
    const query = "insert into users(username) values(?)"
    
    db.query(query,[username],(err,data)=>{
        if(err)
        { console.log(err.sqlMessage)
           res.status(500).send(err.sqlMessage) } 
        else res.status(200).send("User created");
    })
}

//get the events of a particular user


const getUserEvents =  (req, res) => {
  const userId = req.body.id;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required.' });
  }

  const query1 = `
  SELECT *
  FROM users
  WHERE id = ?;
`;
 
 db.query(query1, [userId], (err, results) => { 
  if (err) {
   
    return res.status(500).send("Internal server error");
    
  }
   else if(results.length === 0)
    {
     return res.status(404).send("Not a user");
    }
   else{
    // Get the current date
  const currentDate = new Date();

  // Fetch user's events
  const query = `
    SELECT *
    FROM events e
    JOIN participants p ON e.event_id = p.event_id
    WHERE p.id = ?;
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching user events:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Separate events into past, current, and future
    const pastEvents = [];
    const currentEvents = [];
    const futureEvents = [];

    for (const event of results) {
      const eventStartTime = new Date(event.start_time);
      const eventEndTime = new Date(event.end_time);

      if (eventEndTime < currentDate) {
        pastEvents.push(event);
      } else if (eventStartTime <= currentDate && eventEndTime >= currentDate) {
        currentEvents.push(event);
      } else {
        futureEvents.push(event);
      }
    }

    // Combine all events and sort by start_time in descending order
    const allEvents = [...pastEvents, ...currentEvents, ...futureEvents].sort(
      (a, b) => new Date(b.start_time) - new Date(a.start_time)
    );

    return res.status(200).json({
      pastEvents,
      currentEvents,
      futureEvents,
      allEvents,
    });
  });
   } 

})

};

  //Cancel the event of a user if it is before 8 hours

const cancelEvent =  (req, res) => {
  const userId = req.body.id;
  const eventId = req.body.event_id;

  if (!userId || !eventId) {
    return res.status(400).json({ error: 'User ID and Event ID are required.' });
  }

  // Check if the event start time is at least 8 hours away
  const query = `
    SELECT start_time
    FROM events
    WHERE event_id = ?;
  `;

  db.query(query, [eventId], (err, results) => {
    if (err) {
      console.error('Error checking event start time:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    const eventStartTime = new Date(results[0].start_time);
    const currentTime = new Date();
    const timeDifference = eventStartTime - currentTime;

    const eightHoursInMillis = 8 * 60 * 60 * 1000;

    if (timeDifference < eightHoursInMillis) {
      return res.status(400).json({ error: 'Event cannot be canceled less than 8 hours before start time.' });
    }

    // Delete the user's participation record from the participants table
    const deleteQuery = `
      DELETE FROM participants
      WHERE id = ? AND event_id = ?;
    `;

    db.query(deleteQuery, [userId, eventId], (deleteErr) => {
      if (deleteErr) {
        console.error('Error canceling event:', deleteErr);
        return res.status(500).json({ error: 'Internal server error' });
      }

      res.status(200).json({ message: 'Event canceled successfully.' });
    });
  });
};



module.exports = {postUser,getUserEvents,cancelEvent};