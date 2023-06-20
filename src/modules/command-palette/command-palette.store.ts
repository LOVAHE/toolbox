import { defineStore } from 'pinia';
import _ from 'lodash';
import type { PaletteOption } from './command-palette.types';
import { useToolStore } from '@/tools/tools.store';
import { useFuzzySearch } from '@/composable/fuzzySearch';
import { useStyleStore } from '@/stores/style.store';

import SunIcon from '~icons/mdi/white-balance-sunny';
import GithubIcon from '~icons/mdi/github';
import BugIcon from '~icons/mdi/bug-outline';

export const useCommandPaletteStore = defineStore('command-palette', () => {
  const toolStore = useToolStore();
  const styleStore = useStyleStore();
  const searchPrompt = ref('');

  const toolsOptions = toolStore.tools.map(tool => ({
    ...tool,
    to: tool.path,
    toolCategory: tool.category,
    category: 'home.commandPaletteStore.tools',
  }));

  const searchOptions: PaletteOption[] = [
    ...toolsOptions,
    {
      name: 'Toggle dark mode',
      description: 'Toggle dark mode on or off.',
      action: () => styleStore.toggleDark(),
      icon: SunIcon,
      category: 'home.commandPaletteStore.actions',
      keywords: ['dark', 'theme', 'toggle', 'mode', 'light', 'system'],
    },
    {
      name: 'Github repository',
      href: 'https://github.com/CorentinTh/it-tools',
      category: 'home.commandPaletteStore.external',
      description: 'View the source code of it-tools on Github.',
      keywords: ['github', 'repo', 'repository', 'source', 'code'],
      icon: GithubIcon,
    },
    {
      name: 'Report a bug or an issue',
      description: 'Report a bug or an issue to help improve it-tools.',
      href: 'https://github.com/CorentinTh/it-tools/issues/new/choose',
      category: 'home.commandPaletteStore.actions',
      keywords: ['report', 'issue', 'bug', 'problem', 'error'],
      icon: BugIcon,
    },
  ];

  const { searchResult } = useFuzzySearch({
    search: searchPrompt,
    data: searchOptions,
    options: {
      keys: [{ name: 'name', weight: 2 }, 'description', 'keywords', 'category'],
      threshold: 0.3,
    },
  });

  const filteredSearchResult = computed(() =>
    _.chain(searchResult.value)
      .groupBy('category')
      .mapValues(categoryOptions => _.take(categoryOptions, 5))
      .value(),
  );

  return {
    filteredSearchResult,
    searchPrompt,
  };
});
