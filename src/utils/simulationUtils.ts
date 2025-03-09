
import { Node, Edge } from 'reactflow';
import { toast } from '@/components/ui/use-toast';
import { EdgeConnection } from '@/types/simulation';

/**
 * Builds a graph representation of the factory flow for simulation
 */
export const buildFactoryGraph = (
  nodes: Node[], 
  edges: Edge[]
): {
  edgeMap: Map<string, EdgeConnection[]>;
  connectedNodes: Set<string>;
  startNodeIds: string[];
} => {
  const edgeMap = new Map<string, EdgeConnection[]>();
  
  // Create an edge map for connections
  edges.forEach(edge => {
    const sources = edgeMap.get(edge.source) || [];
    sources.push({ 
      targetId: edge.target, 
      transitTime: edge.data?.transitTime || 0 
    });
    edgeMap.set(edge.source, sources);
  });
  
  // Find all nodes that are targets (not starting nodes)
  const allTargets = new Set(edges.map(e => e.target));
  
  // Find starting nodes (those that have outgoing edges but no incoming edges)
  const startNodeIds = nodes.filter(n => 
    !allTargets.has(n.id) && 
    edgeMap.has(n.id) && 
    edgeMap.get(n.id)!.length > 0
  ).map(n => n.id);
  
  // If no valid start nodes were found, display a warning
  if (startNodeIds.length === 0) {
    toast({
      title: "Simulation Error",
      description: "Could not identify the starting point of your process flow. Ensure nodes are connected.",
      variant: "destructive"
    });
  }
  
  // Find all connected nodes in the graph
  const connectedNodes = new Set<string>();
  
  // Recursive function to identify all connected nodes
  const findConnectedNodes = (nodeId: string) => {
    if (connectedNodes.has(nodeId)) return;
    connectedNodes.add(nodeId);
    
    const outgoingEdges = edgeMap.get(nodeId) || [];
    outgoingEdges.forEach(edge => {
      findConnectedNodes(edge.targetId);
    });
  };
  
  // Mark all nodes that are reachable from start nodes
  startNodeIds.forEach(nodeId => {
    findConnectedNodes(nodeId);
  });
  
  return { edgeMap, connectedNodes, startNodeIds };
};

/**
 * Calculates system stats after simulation completes
 */
export const calculateSystemStats = (
  nodes: Node[], 
  connectedNodes: Set<string>
): {
  bottleneckId: string | null;
  nodeUtilizations: Map<string, number>;
} => {
  let bottleneckId = null;
  let maxCycleTime = 0;
  const nodeUtilizations = new Map<string, number>();
  
  // Find bottleneck and calculate utilizations
  nodes.forEach(node => {
    if (!connectedNodes.has(node.id)) return;
    
    const nodeData = node.data;
    if (!nodeData) return;
    
    const cycleTime = nodeData.cycleTime || 0;
    const maxCapacity = nodeData.maxCapacity || 1;
    const adjustedCycleTime = maxCapacity > 1 ? cycleTime / maxCapacity : cycleTime;
    
    if (adjustedCycleTime > maxCycleTime) {
      maxCycleTime = adjustedCycleTime;
      bottleneckId = node.id;
    }
  });
  
  // Calculate utilization percentages based on bottleneck
  nodes.forEach(node => {
    if (!connectedNodes.has(node.id)) {
      nodeUtilizations.set(node.id, 0);
      return;
    }
    
    const nodeData = node.data;
    if (!nodeData) return;
    
    const cycleTime = nodeData.cycleTime || 0;
    const maxCapacity = nodeData.maxCapacity || 1;
    const adjustedCycleTime = maxCapacity > 1 ? cycleTime / maxCapacity : cycleTime;
    
    const utilization = Math.min(100, Math.round((adjustedCycleTime / maxCycleTime) * 100));
    nodeUtilizations.set(node.id, utilization);
  });
  
  return { bottleneckId, nodeUtilizations };
};
