import { HistoryLine, HistoryNode, Message } from "./types";


export function getLastNode(root: HistoryLine): HistoryNode {
  if (root.currentIndex < 0) {
    throw new Error("root.currentIndex < 0");
  }
  const currentNode = root.nodes[root.currentIndex];
  if (currentNode.next === null) {
    return currentNode;
  } else {
    return getLastNode(currentNode.next);
  }
}


export function getLinearLines(root: HistoryLine): HistoryLine[] {
  const lines: HistoryLine[] = [];
  if (root.currentIndex < 0) {
    return lines;
  }
  let line = root;
  lines.push(line);
  let node = root.nodes[root.currentIndex];
  while (node.next !== null) {
    line = node.next;
    lines.push(line);
    node = line.nodes[line.currentIndex];
  }
  return lines;
}


export function getLinearMessages(root: HistoryLine): Message[] {
  return getLinearLines(root).map(line => line.nodes[line.currentIndex].message);
}
