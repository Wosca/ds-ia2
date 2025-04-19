"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CreateTeamDialog() {
  const [open, setOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [game, setGame] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Here you would handle the team creation
    console.log("Team created:", { teamName, game, teamSize, description });

    // Reset form and close dialog
    setTeamName("");
    setGame("");
    setTeamSize("");
    setDescription("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create New Team</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create a New Team</DialogTitle>
            <DialogDescription>
              Form a new team for tournaments and competitive play.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid items-center gap-2">
              <Label htmlFor="teamName">Team Name</Label>
              <Input
                id="teamName"
                placeholder="e.g., Phoenix Blaze"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
              />
            </div>
            <div className="grid items-center gap-2">
              <Label htmlFor="game">Game</Label>
              <Select value={game} onValueChange={setGame} required>
                <SelectTrigger id="game">
                  <SelectValue placeholder="Select a game" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csgo">CS:GO</SelectItem>
                  <SelectItem value="valorant">Valorant</SelectItem>
                  <SelectItem value="lol">League of Legends</SelectItem>
                  <SelectItem value="dota2">Dota 2</SelectItem>
                  <SelectItem value="overwatch">Overwatch</SelectItem>
                  <SelectItem value="rocketleague">Rocket League</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid items-center gap-2">
              <Label htmlFor="teamSize">Team Size</Label>
              <Select value={teamSize} onValueChange={setTeamSize} required>
                <SelectTrigger id="teamSize">
                  <SelectValue placeholder="Number of players" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 (Solo)</SelectItem>
                  <SelectItem value="2">2 (Duo)</SelectItem>
                  <SelectItem value="3">3 (Trio)</SelectItem>
                  <SelectItem value="4">4 (Quad)</SelectItem>
                  <SelectItem value="5">5 (Standard)</SelectItem>
                  <SelectItem value="6+">6+ (Extended)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid items-center gap-2">
              <Label htmlFor="description">Team Description</Label>
              <Input
                id="description"
                placeholder="A brief description of your team"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Create Team</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
