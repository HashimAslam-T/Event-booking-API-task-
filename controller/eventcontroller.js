const db = require("../database/db")

//Create a new event

const postEvent = (req,res)=>{
    const eventName = req.body.event_name;
    const startTime = req.body.start_time;
    const endTime = req.body.end_time;
    const query = "insert into events(event_name,start_time,end_time) values(?,?,?)"
    db.query(query,[eventName,startTime,endTime],(err,data)=>{
        if(err){ console.log(err.sqlMessage)
           res.status(400).send(err.sqlMessage) } 
        else res.status(200).send("Event Created");
    })
}

//To get ongoing participants

const getOngoingParticipants =  (req, res) => {
  // Get the current time
  const currentTime = new Date();

  // Fetch participants and their associated event names for ongoing events
  const query = `
    SELECT u.username AS participant_name, e.event_name AS event_name
    FROM participants p
    JOIN users u ON p.id = u.id
    JOIN events e ON p.event_id = e.event_id
    WHERE e.start_time <= ? AND e.end_time >= ?;
  `;

  db.query(query, [currentTime, currentTime], (err, results) => {
    if (err) {
      console.error('Error fetching ongoing participants:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.status(200).json(results);
  });
};




module.exports = {postEvent,getOngoingParticipants};