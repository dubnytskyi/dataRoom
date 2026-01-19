import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyFolderState } from './EmptyFolderState';
import { UI_TEXT } from '../../constants/messages';

describe('EmptyFolderState', () => {
  it('renders the empty state title', () => {
    render(<EmptyFolderState />);
    expect(screen.getByText(UI_TEXT.EMPTY_STATE.TITLE)).toBeInTheDocument();
  });

  it('renders all three instruction sections', () => {
    render(<EmptyFolderState />);

    expect(screen.getByText(UI_TEXT.EMPTY_STATE.UPLOAD_TITLE)).toBeInTheDocument();
    expect(screen.getByText(UI_TEXT.EMPTY_STATE.UPLOAD_DESC)).toBeInTheDocument();

    expect(screen.getByText(UI_TEXT.EMPTY_STATE.ORGANIZE_TITLE)).toBeInTheDocument();
    expect(screen.getByText(UI_TEXT.EMPTY_STATE.ORGANIZE_DESC)).toBeInTheDocument();

    expect(screen.getByText(UI_TEXT.EMPTY_STATE.MOVE_TITLE)).toBeInTheDocument();
    expect(screen.getByText(UI_TEXT.EMPTY_STATE.MOVE_DESC)).toBeInTheDocument();
  });

  it('renders the folder icon', () => {
    const { container } = render(<EmptyFolderState />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('has proper structure with three columns on desktop', () => {
    const { container } = render(<EmptyFolderState />);
    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('md:grid-cols-3');
  });
});
