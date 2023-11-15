
import React, { useState, useEffect } from "react";
import axios from "axios";

const TicketList = () => {
  const [data, setData] = useState({ tickets: [], users: [] });
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedGrouping, setSelectedGrouping] = useState(
    localStorage.getItem("selectedGrouping") || null
  );
  const [selectedOrdering, setSelectedOrdering] = useState(
    localStorage.getItem("selectedOrdering") || null
  );

  const handleFilterButtonClick = () => {
    setShowFilterDropdown(!showFilterDropdown);
  };

  const handleGroupingSelect = (option) => {
    setSelectedGrouping(option);
    localStorage.setItem("selectedGrouping", option);
  };

  const handleOrderingSelect = (option) => {
    setSelectedOrdering(option);
    localStorage.setItem("selectedOrdering", option);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.quicksell.co/v1/internal/frontend-assignment"
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run the effect only once
const groupAndOrderTickets = () => {
  // Grouping logic
  let groupedTickets = [];
  if (selectedGrouping === "ByUser") {
    groupedTickets = groupByUser(data.tickets);
  } else if (selectedGrouping === "ByPriority") {
    groupedTickets = groupByPriority(data.tickets);
  } else if (selectedGrouping === "ByStatus") {
    groupedTickets = groupByStatus(data.tickets);
  }

  // Ordering logic
  if (selectedOrdering === "Priority") {
    groupedTickets.forEach((group) => {
      group.tickets.sort((a, b) => b.priority - a.priority);
    });
  } else if (selectedOrdering === "Title") {
    groupedTickets.forEach((group) => {
      group.tickets.sort((a, b) => a.title.localeCompare(b.title));
    });
  }

  return groupedTickets;
};
const getStatusImage = (status) => {
  switch (status) {
    case "Todo":
      return require(`./5.png`);
    case "In progress":
      return require(`./6.png`);
    case "Done":
      return require(`./7.png`);
    case "Backlog":
      return require(`./8.png`);
    case "Cancelled":
      return require(`./9.png`);
    default:
      return require(`./5.png`); // Use a default image for unknown status
  }
};
const groupByUser = (tickets) => {
  // Implement grouping by user logic
  return tickets.reduce((result, ticket) => {
    const userGroup = result.find((group) => group.key === ticket.userId);
    if (userGroup) {
      userGroup.tickets.push(ticket);
    } else {
      result.push({ key: ticket.userId, tickets: [ticket] });
    }
    return result;
  }, []);
};

const groupByPriority = (tickets) => {
  // Implement grouping by priority logic
  return tickets.reduce((result, ticket) => {
    const priorityGroup = result.find((group) => group.key === ticket.priority);
    if (priorityGroup) {
      priorityGroup.tickets.push(ticket);
    } else {
      result.push({ key: ticket.priority, tickets: [ticket] });
    }
    return result;
  }, []);
};

const groupByStatus = (tickets) => {
  // Implement grouping by status logic
  return tickets.reduce((result, ticket) => {
    const statusGroup = result.find((group) => group.key === ticket.status);
    if (statusGroup) {
      statusGroup.tickets.push(ticket);
    } else {
      result.push({ key: ticket.status, tickets: [ticket] });
    }
    return result;
  }, []);
};
const getGroupIcon = (status) => {
  switch (status) {
    case "Todo":
      return require(`./5.png`);
    case "In progress":
      return require(`./6.png`);
    case "Done":
      return require(`./7.png`);
    case "Backlog":
      return require(`./8.png`);
    case "Cancelled":
      return require(`./9.png`);
    case 3:
      return require(`./3.png`);
    case 2:
      return require(`./2.png`);
    case 4:
      return require(`./4.png`);
    case 0:
      return require(`./0.png`);
    case 1:
      return require(`./1.png`);
    default:
      return require(`./5.png`); // Use a default image for unknown status
  }
};
 const getGroupHeading = (groupKey) => {
   switch (groupKey) {
     case 4:
       return "Urgent";
     case 3:
       return "High";
     case 2:
       return "Medium";
     case 1:
       return "Low";
     case 0:
       return "No priority";
     // Add more cases for other group keys as needed
     default:
       return groupKey;
   }
 };
const groupedAndOrderedTickets = groupAndOrderTickets();
  return (
    <div className="grey-background">
      <div className="filter-container">
        <div className="filter-button" onClick={handleFilterButtonClick}>
          <span>Display</span>
          <div className="filter-icon">&#9776;</div>
        </div>
        {showFilterDropdown && (
          <div className="filter-dropdown">
            <div className="dropdown-item">
              <strong>Grouping</strong>
              <ul>
                <li onClick={() => handleGroupingSelect("ByUser")}>By User</li>
                <li onClick={() => handleGroupingSelect("ByPriority")}>
                  By Priority
                </li>
                <li onClick={() => handleGroupingSelect("ByStatus")}>
                  By Status
                </li>
              </ul>
            </div>
            <div className="dropdown-item">
              <strong>Ordering</strong>
              <ul>
                <li onClick={() => handleOrderingSelect("Priority")}>
                  Priority
                </li>
                <li onClick={() => handleOrderingSelect("Title")}>Title</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      <h1>Ticket List</h1>
      <div className="ticket-columns">
        {groupedAndOrderedTickets.map((group) => (
          <div key={group.key} className="group-column">
            <div className="ticket-header">
              <img
                src={getGroupIcon(group.key)}
                alt={`Group Icon for ${group.key}`}
                className="priority-icon"
              />
              <h2> {getGroupHeading(group.key)}</h2>
            </div>
            {group.tickets.map((ticket) => (
              <div key={ticket.id} className="ticket-card">
                <div className="ticket-header">
                  <img
                    src={require(`./${ticket.priority}.png`)}
                    // src={require(`./0.png`)}
                    // alt={`Priority ${ticket.priority}`}
                    className="priority-icon"
                  />
                  <strong>{ticket.title}</strong>
                </div>
                <div className="ticket-details">
                  <p>
                    <span className="grey-text">{ticket.id}</span>
                  </p>
                  
                  <img
                    src={getStatusImage(ticket.status)}
                    alt={`${ticket.status}`}
                    className="status-icon"
                  />
                  <div className="box">
                    <div className="circle-mark"></div>
                    <p> {ticket.tag} </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketList;
