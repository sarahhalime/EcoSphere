import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Data Types
export type SpeciesCategoryData = { category: string; count: number };
export type ConservationStatusData = { name: string; value: number; color: string };

// Static Category List
export const speciesCategories = [
  { name: 'Birds', taxonKey: 212, color: '#3b82f6' },
  { name: 'Mammals', taxonKey: 359, color: '#10b981' },
  { name: 'Reptiles', taxonKey: 358, color: '#f59e0b' },
  { name: 'Amphibians', taxonKey: 131, color: '#ef4444' },
  { name: 'Fish', taxonKey: 777, color: '#8b5cf6' },
  { name: 'Insects', taxonKey: 216, color: '#06b6d4' },
];

// Fetch GBIF Species Count by Category
export const fetchGBIFCounts = async (): Promise<SpeciesCategoryData[]> => {
  const results: SpeciesCategoryData[] = [];
  for (const category of speciesCategories) {
    const res = await fetch(
      `https://api.gbif.org/v1/species/count?rank=SPECIES&classKey=${category.taxonKey}`
    );
    const data = await res.json();
    results.push({ category: category.name, count: data.count });
  }
  return results;
};

// Fetch iNaturalist Conservation Status
export const fetchINaturalistConservationStatus = async (): Promise<ConservationStatusData[]> => {
  const statusCounts: Record<string, number> = {};
  const res = await fetch(
    'https://api.inaturalist.org/v1/taxa?rank=species&per_page=100&taxon_id=3'
  );
  const data = await res.json();

  for (const taxon of data.results) {
    const status = taxon.conservation_status?.status_name;
    if (status) {
      const name = formatStatus(status);
      statusCounts[name] = (statusCounts[name] || 0) + 1;
    }
  }

  const colorMap: Record<string, string> = {
    'Least Concern': '#10b981',
    'Near Threatened': '#f59e0b',
    'Vulnerable': '#f97316',
    'Endangered': '#ef4444',
    'Critically Endangered': '#991b1b',
  };

  const result: ConservationStatusData[] = Object.entries(statusCounts).map(
    ([name, count]) => ({
      name,
      value: count,
      color: colorMap[name] || '#64748b',
    })
  );

  return result;
};

// Normalize Status Strings
export const formatStatus = (rawStatus: string): string => {
  const lower = rawStatus.toLowerCase();
  if (lower.includes('least')) return 'Least Concern';
  if (lower.includes('near')) return 'Near Threatened';
  if (lower.includes('vulnerable')) return 'Vulnerable';
  if (lower.includes('endangered') && lower.includes('critically')) return 'Critically Endangered';
  if (lower.includes('endangered')) return 'Endangered';
  return 'Unknown';
};

// Main Analytics Component
export const Analytics = () => {
  const [speciesData, setSpeciesData] = useState<SpeciesCategoryData[]>([]);
  const [threatLevels, setThreatLevels] = useState<ConservationStatusData[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const speciesCounts = await fetchGBIFCounts();
      setSpeciesData(speciesCounts);

      const conservationData = await fetchINaturalistConservationStatus();
      setThreatLevels(conservationData);
    };
    loadData();
  }, []);
};
