"use client";
import { useState } from "react";
import { Button, TextField, Container, Typography, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import CheckIcon from "@mui/icons-material/CheckCircle";

import { trpc } from "../_trpc/client";
import { serverClient } from "../_trpc/serverClient";

export default function TodoList({
  initialTodos,
}: {
  initialTodos: Awaited<ReturnType<(typeof serverClient)["getTodos"]>>;
}) {
  const [content, setContent] = useState("");

  const getTodos = trpc.getTodos.useQuery(undefined, {
    initialData: initialTodos,
    refetchOnMount: false,
    refetchOnReconnect: false,
    // refetchOnWindowFocus: false,
  });
  const addTodo = trpc.addTodo.useMutation({
    onSettled: () => {
      getTodos.refetch();
    },
  });
  const setDone = trpc.setDone.useMutation({
    onSettled: () => {
      getTodos.refetch();
    },
  });

  const onSubmit = () => {
    setContent("");
    addTodo.mutate({ todo: content });
  };
  return (
    <Container
      maxWidth="sm"
      style={{
        paddingTop: 16,
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex" }}>
        <TextField
          label="add todo"
          placeholder="new todo..."
          onChange={(e) => setContent(e.target.value)}
          value={content}
          style={{ paddingRight: 16 }}
        />
        <Button
          onClick={onSubmit}
          disabled={!!!content.length}
          variant="contained"
        >
          add todo
        </Button>
      </div>
      <div
        style={{
          paddingTop: 16,
        }}
      >
        {getTodos.data.map((i) => (
          <List>
            <ListItem
              secondaryAction={
                i.status ? (
                  <div />
                ) : (
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => setDone.mutate({ id: i.id })}
                  >
                    <CheckIcon color="success" />
                  </IconButton>
                )
              }
            >
              <ListItemText
                primary={i.todo}
                primaryTypographyProps={{
                  style: { textDecoration: i.status ? "line-through" : "" },
                }}
                secondary={new Date(i.createdAt).toLocaleTimeString()}
              />
            </ListItem>
          </List>
        ))}
      </div>
    </Container>
  );
}
