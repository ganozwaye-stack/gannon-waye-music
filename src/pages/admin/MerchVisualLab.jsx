import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductAssetsTab from '@/components/merch-visual-lab/ProductAssetsTab';
import BgRemovalGuideTab from '@/components/merch-visual-lab/BgRemovalGuideTab';
import TransparentUploadsTab from '@/components/merch-visual-lab/TransparentUploadsTab';
import CompositionBuilderTab from '@/components/merch-visual-lab/CompositionBuilderTab';
import ReelBuilderTab from '@/components/merch-visual-lab/ReelBuilderTab';
import StoreVisualsTab from '@/components/merch-visual-lab/StoreVisualsTab';
import VisualApprovalTab from '@/components/merch-visual-lab/VisualApprovalTab';
import ExportCentreTab from '@/components/merch-visual-lab/ExportCentreTab';

export default function MerchVisualLab() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-3xl text-foreground mb-1">Merch Visual Lab</h1>
        <p className="text-muted-foreground text-sm">
          Create premium transparent cut-outs, layered compositions, reel assets and store visuals for the Thank You merch release.
        </p>
        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs border border-primary/30 text-primary/80">
          <span>✦</span> Respect is earned. Not a game you make me play.
        </div>
      </div>

      <Tabs defaultValue="assets">
        <TabsList className="flex-wrap h-auto gap-1 mb-6">
          <TabsTrigger value="assets">Product Assets</TabsTrigger>
          <TabsTrigger value="guide">BG Removal Guide</TabsTrigger>
          <TabsTrigger value="uploads">PNG Uploads</TabsTrigger>
          <TabsTrigger value="composer">Composition Builder</TabsTrigger>
          <TabsTrigger value="reel">Reel Builder</TabsTrigger>
          <TabsTrigger value="store">Store Visuals</TabsTrigger>
          <TabsTrigger value="approval">Approval Queue</TabsTrigger>
          <TabsTrigger value="export">Export Centre</TabsTrigger>
        </TabsList>

        <TabsContent value="assets"><ProductAssetsTab /></TabsContent>
        <TabsContent value="guide"><BgRemovalGuideTab /></TabsContent>
        <TabsContent value="uploads"><TransparentUploadsTab /></TabsContent>
        <TabsContent value="composer"><CompositionBuilderTab /></TabsContent>
        <TabsContent value="reel"><ReelBuilderTab /></TabsContent>
        <TabsContent value="store"><StoreVisualsTab /></TabsContent>
        <TabsContent value="approval"><VisualApprovalTab /></TabsContent>
        <TabsContent value="export"><ExportCentreTab /></TabsContent>
      </Tabs>
    </div>
  );
}