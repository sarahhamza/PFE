//import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Button } from "primereact/button";
import Paper from "@mui/material/Paper";

const RoomTable = ({ availableRooms, setSelectedRoom }) => {

  return (
    <div className="roomTable">
      <Table component={Paper} className="table">
        <TableHead>
          <TableRow>
            <TableCell>Room Number</TableCell>
            <TableCell>Surface</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Property</TableCell>
            <TableCell>State</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {availableRooms.map((room) => (
            <TableRow key={room._id}>
              <TableCell>{room.nbrRoom}</TableCell>
              <TableCell>{room.Surface}</TableCell>
              <TableCell>{room.Categorie}</TableCell>
              <TableCell>{room.Property}</TableCell>
              <TableCell>{room.State}</TableCell>
              <TableCell>
                <Button onClick={() => setSelectedRoom(room)}>Select</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RoomTable;
